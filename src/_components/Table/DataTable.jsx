import React from "react";
import { useTable, usePagination, useSortBy } from 'react-table';
import { TableActions } from "./TableActions";

import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import FirstPageOutlinedIcon from '@material-ui/icons/FirstPageOutlined';
import LastPageOutlinedIcon from '@material-ui/icons/LastPageOutlined';

import { IconButton } from '../'

export const DataTable = ({ columns, data, edit, remove, more }) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    )

    // Render the UI for your table
    return (
        <div className='w-100'>
            <table className='table' {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr className='row'{...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <KeyboardArrowDownOutlinedIcon />
                                                : <KeyboardArrowUpOutlinedIcon />
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr className='row'{...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{
                                        cell.column.Header === 'Действия' ?
                                            <TableActions user={row.original} edit={edit} remove={remove} more={more} />
                                            :
                                            cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr className='row'>
                        <td colSpan={headerGroups[0].headers.length}>
                            <div className="pagination">
                                <div>
                                    {/* <span>
                                        Перейти к странице:{' '}
                                        <input
                                            type="number"
                                            defaultValue={pageIndex + 1}
                                            onChange={e => {
                                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                                gotoPage(page)
                                            }}
                                            style={{ width: '100px' }}
                                        />
                                    </span> */}

                                    <select
                                        value={pageSize}
                                        onChange={e => {
                                            setPageSize(Number(e.target.value))
                                        }}
                                    >
                                        {[5, 10, 20].map(pageSize => (
                                            <option key={pageSize} value={pageSize}>
                                                Показать {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                    {' '}
                                    <span>Всего: {data.length}</span>
                                </div>
                                <div>
                                    <span>
                                        Страница{' '}
                                        <strong>
                                            {pageIndex + 1} из {pageOptions.length}
                                        </strong>{' '}
                                    </span>
                                    <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                        <FirstPageOutlinedIcon />
                                    </IconButton>
                                    {' '}
                                    <IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                                        <KeyboardArrowLeftOutlinedIcon />
                                    </IconButton>
                                    {' '}
                                    <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
                                        <KeyboardArrowRightOutlinedIcon />
                                    </IconButton>
                                    {' '}
                                    <IconButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                        <LastPageOutlinedIcon />
                                    </IconButton>
                                </div>

                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>


        </div>
    )
}