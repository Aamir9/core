import { Injector } from '@angular/core';

/**
 * Generic paged result DTO
 */
export class PagedResultDto<T = any> {
  items: T[] = [];
  totalCount = 0;
}

/**
 * Generic paged request DTO
 */
export class PagedRequestDto {
  skipCount = 0;
  maxResultCount = 10;
}

/**
 * Generic base class for paginated lists.
 * ABP-free and reusable.
 */
export abstract class PagedListBase<T> {
  pageSize = 10;
  pageNumber = 1;
  totalItems = 0;
  totalPages = 1;
  isTableLoading = false;

  constructor(public injector: Injector) {}

  /**
   * Refresh current page
   */
  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  /**
   * Load a specific page
   */
  getDataPage(page: number): void {
    const req = new PagedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;

    this.isTableLoading = true;

    this.list(req, page, () => {
      this.isTableLoading = false;
    });
  }

  /**
   * Update paging info
   */
  protected showPaging(result: PagedResultDto, pageNumber: number): void {
    this.totalItems = result.totalCount;
    this.totalPages = Math.max(1, Math.ceil(result.totalCount / this.pageSize));
    this.pageNumber = pageNumber;
  }

  /**
   * Must be implemented by derived class:
   * Load data for current page
   */
  protected abstract list(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void;

  /**
   * Must be implemented by derived class:
   * Delete an entity
   */
  protected abstract delete(entity: T): void;
}
















// export class PagedListBase {
// }
