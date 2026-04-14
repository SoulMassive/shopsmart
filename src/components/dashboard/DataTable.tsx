interface DataTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  title?: string;
}

function DataTable<T extends { id?: string | number; _id?: string | number }>({ columns, data, title }: DataTableProps<T>) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col, i) => (
                <th key={i} className={`px-5 py-3 text-left font-medium text-muted-foreground ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id || row._id || rowIndex} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className={`px-5 py-3 text-card-foreground ${col.className || ""}`}>
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : String((row as any)[col.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
