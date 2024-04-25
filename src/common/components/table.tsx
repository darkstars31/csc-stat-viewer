import * as React from "react";

type Row = {
  [key: string]: React.ReactNode | string | number | null | undefined;
};

type Props = {
  header?: boolean;
  rows: Row[];
};

const formatNumber = (value: number) => {
  const roundedValue = value.toFixed(2);
  return roundedValue.endsWith(".00") ? value.toFixed(0) : roundedValue;
};

const formatBoolean = (value: boolean) => (value ? "True" : "False");

const formatValue = (value: React.ReactNode | string | number | null | undefined): React.ReactNode => {
  if (typeof value === "number") {
    return formatNumber(value);
  } else if (typeof value === "boolean") {
    return formatBoolean(value);
  } else if (React.isValidElement(value)) {
    return value;
  }
  return value ?? "n/a";
};

export function Table({ rows, header = true }: Props) {
    const values = React.useMemo(() => {
    const columnNames = rows?.[0] ? Object.keys(rows[0]) : [];
    if (columnNames.length < 3) {
      return [];
    }
    const thirdColumnName = columnNames[2];
    return rows.map(row => {
      const value = row[thirdColumnName];
      return typeof value === "number" ? value : 0;
    });
  }, [rows]);

  const [highestValue, secondHighestValue] = React.useMemo(() => {
    const sortedValues = Array.from(new Set(values)).sort((a, b) => b - a);
    return [sortedValues[0], sortedValues[1]];
  }, [values]);

  const getRowColorClass = React.useCallback((value: number | string): string => {
    if (typeof value === "number" && value !== 0) {
      if (value === highestValue) {
        return "bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent";
      } else if (value === secondHighestValue) {
        return "bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent";
      }
    }
    return "bg-midnight1";
  }, [highestValue, secondHighestValue]);
  

  return (
    <div className="overflow-hidden overflow-x-auto w-full rounded border border-gray-600">
      <table style={{tableLayout: 'fixed', width: '100%'}} className="min-w-full divide-y divide-gray-200 text-sm">
        {header && rows[0] && (
          <thead className="bg-gray-700">
            <tr>
              {Object.keys(rows[0]).map((key, colIndex) => (
                <th
                  key={key}
                  style={{width: colIndex === 0 ? '40%' : 'auto'}}
                  className={`whitespace-nowrap px-4 py-2 text-${
                    colIndex === Object.keys(rows[0]).length - 1 ? "center" : "left"
                  } font-extrabold text-md text-gray-300 bg-midnight2`}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => {
            const thirdColumnKey = Object.keys(row)[2];
            const value = row[thirdColumnKey];
            const numberValue = typeof value === "number" ? value : 0;
            return (
              <tr key={rowIndex} className={getRowColorClass(numberValue)}>
                {Object.entries(row).map(([key, value], colIndex) => (
                  <td
                    key={`${rowIndex}-${key}-${colIndex}`}
                    style={{width: colIndex === 0 ? '40%' : 'auto'}}
                    className={`whitespace-nowrap px-4 py-2 text-sm ${colIndex === Object.entries(row).length - 1 ? "text-center" : ""}`}
                  >
                    <div
                      data-row-col={`${rowIndex},${colIndex}`}
                      className={colIndex === 0 ? `text-white-${rowIndex + 1}00` : ""}
                    >
                      {formatValue(value)}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}