import { useEffect, useState } from 'react'
import { Button } from '@imput/components/Button'
import { Input } from '@imput/components/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@imput/components/Table'
import { Plus, Trash } from '@imput/components/Icon'
import { CustomControlProps } from 'local-imput-cms'

interface TableData {
  headers: string[]
  rows: string[][]
}

export function TableControl({ useFormContext }: CustomControlProps) {
  const { setValue } = useFormContext()
  const [tableData, setTableData] = useState<TableData>({
    headers: ['Header 1', 'Header 2', 'Header 3', 'Header 4'],
    rows: [
      ['Value 1', 'Value 2', 'Empty', 'Value 2'],
      ['Value 1', 'Value 2', 'Another value', 'Value'],
    ],
  })

  useEffect(() => {
    setValue('data', tableData)
  }, [tableData])

  const addColumn = () => {
    const newHeader = `Header ${tableData.headers.length + 1}`
    setTableData((prev) => ({
      headers: [...prev.headers, newHeader],
      rows: prev.rows.map((row) => [...row, '']),
    }))
  }

  const removeColumn = (index: number) => {
    setTableData((prev) => ({
      headers: prev.headers.filter((_, i) => i !== index),
      rows: prev.rows.map((row) => row.filter((_, i) => i !== index)),
    }))
  }

  const addRow = () => {
    const newRow = new Array(tableData.headers.length).fill('')
    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }))
  }

  const removeRow = (index: number) => {
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index),
    }))
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === rowIndex
          ? row.map((cell, j) => (j === colIndex ? value : cell))
          : row
      ),
    }))
  }

  const updateHeader = (index: number, value: string) => {
    setTableData((prev) => ({
      ...prev,
      headers: prev.headers.map((header, i) => (i === index ? value : header)),
    }))
  }

  return (
    <div className="imp-space-y-2">
      <div className="imp-flex imp-justify-between imp-items-center">
        <h2 className="imp-text-2xl imp-font-bold">Editable Table</h2>
        <div className="imp-space-x-2">
          <Button onClick={addColumn}>
            <Plus className="imp-mr-2 imp-h-4 imp-w-4" /> Add Column
          </Button>
          <Button onClick={addRow}>
            <Plus className="imp-mr-2 imp-h-4 imp-w-4" /> Add Row
          </Button>
        </div>
      </div>
      <div className="imp-border imp-rounded-lg imp-overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {tableData.headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="imp-min-w-[200px]"
                  style={{ minWidth: 175 }}
                >
                  <div className="imp-flex imp-items-center imp-space-x-2">
                    <Input
                      value={header}
                      onChange={(e) => updateHeader(index, e.target.value)}
                      className="imp-min-w-[100px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(index)}
                    >
                      <Trash className="imp-h-4 imp-w-4" />
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex}>
                    <Input
                      value={cell}
                      onChange={(e) =>
                        updateCell(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <Trash className="imp-h-4 imp-w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
