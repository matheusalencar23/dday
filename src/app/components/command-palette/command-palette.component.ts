import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import {
  heroHomeSolid,
  heroShoppingBagSolid,
  heroUserGroupSolid,
  heroUserSolid,
} from '@ng-icons/heroicons/solid';
import { tablerPigMoney } from '@ng-icons/tabler-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  Subject,
  catchError,
  debounceTime,
  of,
  distinctUntilChanged,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ModalRef } from 'src/app/models/modal-ref';
import {
  GlobalSearchService,
  SearchResult,
  SearchResultGroup,
} from 'src/app/services/global-search.service';

type IndexedResult = SearchResult & { index: number };
type IndexedGroup = Omit<SearchResultGroup, 'results'> & { results: IndexedResult[] };

const SEARCH_DEBOUNCE_MS = 150;

@Component({
  selector: 'dd-command-palette',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslateModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss'],
  providers: [
    provideIcons({
      heroMagnifyingGlass,
      heroHomeSolid,
      heroShoppingBagSolid,
      heroUserSolid,
      heroUserGroupSolid,
      tablerPigMoney,
    }),
  ],
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  private readonly searchService = inject(GlobalSearchService);
  private readonly router = inject(Router);
  private readonly modalRef = inject(ModalRef);
  private readonly queryChanges = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  term = '';
  loading = false;
  failed = false;
  groups: IndexedGroup[] = [];
  results: IndexedResult[] = [];
  activeIndex = 0;

  ngOnInit(): void {
    this.queryChanges
      .pipe(
        startWith(''),
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        // switchMap descarta respostas de buscas antigas que chegarem atrasadas
        switchMap((term) =>
          this.searchService.search(term).pipe(catchError(() => of(null)))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((groups) => {
        this.failed = groups === null;
        this.showResults(groups ?? []);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(event: Event): void {
    this.term = (event.target as HTMLInputElement).value;
    this.queryChanges.next(this.term.trim());
  }

  onKeydown(event: KeyboardEvent): void {
    const total = this.results.length;
    if (!total) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.setActive((this.activeIndex + 1) % total);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setActive((this.activeIndex - 1 + total) % total);
        break;
      case 'Home':
        event.preventDefault();
        this.setActive(0);
        break;
      case 'End':
        event.preventDefault();
        this.setActive(total - 1);
        break;
      case 'Enter':
        event.preventDefault();
        this.select(this.results[this.activeIndex]);
        break;
    }
  }

  setActive(index: number): void {
    this.activeIndex = index;
    document.getElementById(this.optionId(index))?.scrollIntoView({ block: 'nearest' });
  }

  select(result: SearchResult | undefined): void {
    if (!result) return;
    this.modalRef.close();
    this.router.navigate([result.route], { queryParams: result.queryParams });
  }

  optionId(index: number): string {
    return `palette-option-${index}`;
  }

  trackResult(_index: number, result: IndexedResult): string {
    return `${result.type}-${result.id}`;
  }

  private showResults(groups: SearchResultGroup[]): void {
    let index = 0;
    this.groups = groups.map((group) => ({
      ...group,
      results: group.results.map((result) => ({ ...result, index: index++ })),
    }));
    this.results = this.groups.flatMap((group) => group.results);
    this.activeIndex = 0;
    this.loading = false;
  }
}
