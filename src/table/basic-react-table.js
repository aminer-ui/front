import React, { } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import classnames from 'classnames';
import styles from './basic-react-table.less';

const BasicTable = ({ columns, data, className, rowKey }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useFilters,
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  // const firstPageRows = rows.slice(0, 20)
  const { className: cn, ...tableProps } = getTableProps();

  return (
    <table {...tableProps} className={classnames(styles.basicReactTable, cn, className)}>
      <thead className={styles.thead}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} className={classnames('tr')}>
            {headerGroup.headers.map(column => {
              const { disableFilters = true, disableSorting = true, filterMultiple, align = 'left',
                width = 'auto', sortType } = column;
              // disableFilters 默认为true 即不显示筛选, 如需要就传参数
              // disableSorting 默认为true 即不显示排序, 如需要排序就传参数
              // align 默认靠左对齐（left）支持center, right 
              // filterMultiple: false 单选select || true 多选 checkbox
              // width 支持跟antd那样传 120 || '120px' || '60%'
              return (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th key={column[rowKey]}
                  width={width} className={classnames('th', `td${align}`)}>
                  <span className='headerWrap'>
                    <span>{column.render('Header')}</span>
                    {/* filter zone */}
                    {!disableFilters && filterMultiple === false && (
                      <span className='filterZone'>
                        {SelectColumnFilter({ column })}
                      </span>
                    )}
                    {/* sort zone */}
                    {!disableSorting && (
                      <span {...column.getHeaderProps(column.getSortByToggleProps())} className='sortZone'>
                        <span className='toUpArrow'></span><span className='toDownArrow'></span>
                      </span>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map(
          (row, i) => {
            const obj = row && row.original || {};
            return prepareRow(row) || (
              <tr {...row.getRowProps()} className='tr' key={obj[rowKey] || i}>
                {row.cells.map(cell => {
                  const { className, align = 'left' } = cell.column;
                  return (
                    <td {...cell.getCellProps()} key={cell.column[rowKey]} className={classnames('td', `td${align}`, className)}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          }
        )}
      </tbody>
    </table>
  )
}

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id }, }) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      if (row.values[id]) {
        options.add(row.values[id])
      }
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  // TODO 这里得支持外面传options [{text: '文本1', value: 1, }, {text: '文本2', value: 2 },]
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export default BasicTable;
