import React, { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./EmptyState";
import { TablePagination } from "./TablePagination";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  searchQuery?: string;
  onRowClick?: (item: T) => void;
  actionColumn?: (item: T) => ReactNode;
  renderPagination?: () => ReactNode;
  disableInternalPagination?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = "No Data Found",
  emptyDescription = "No items match your criteria.",
  searchQuery = "",
  onRowClick,
  actionColumn,
  renderPagination,
  disableInternalPagination = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination only if internal pagination is enabled
  const totalPages = !disableInternalPagination
    ? Math.ceil(data.length / itemsPerPage)
    : 1;
  const startIndex = !disableInternalPagination
    ? (currentPage - 1) * itemsPerPage
    : 0;
  const endIndex = !disableInternalPagination
    ? startIndex + itemsPerPage
    : data.length;
  const currentPageData = !disableInternalPagination
    ? data.slice(startIndex, endIndex)
    : data;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={
          searchQuery
            ? "No items match your search criteria."
            : emptyDescription
        }
      />
    );
  }

  // Handle row click with event propagation prevention
  const handleRowClick = (item: T, e: React.MouseEvent) => {
    if (onRowClick) {
      e.stopPropagation();
      onRowClick(item);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actionColumn && (
                <TableHead key="action-header" className="w-[50px]"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.map((item, index) => (
              <TableRow
                key={keyExtractor(item) || index}
                className={cn(
                  "bg-white dark:bg-secondary/20",
                  onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                )}
                onClick={
                  onRowClick ? (e) => handleRowClick(item, e) : undefined
                }
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${keyExtractor(item)}-${column.key}`}
                    className={`py-3 ${column.className || ""}`}
                  >
                    {column.cell(item)}
                  </TableCell>
                ))}
                {actionColumn && (
                  <TableCell
                    key={`${keyExtractor(item)}-actions`}
                    className="py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actionColumn(item)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!disableInternalPagination && !renderPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          onPageChange={handlePageChange}
        />
      )}
      {renderPagination && renderPagination()}
    </div>
  );
}
