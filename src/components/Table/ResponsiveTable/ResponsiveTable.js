import React from 'react'
import {Table, Tbody, Td, Th, Thead, Tr} from 'react-super-responsive-table'
import './ResponsiveTable.css'

export default function ResponsiveTable(props) {
    return (
        <Table className={props.class ? props.class : ''}>
            <Thead>
                <Tr>
                    {props.headers.map((value, index) => {
                        return <Th key={index}>{value}</Th>
                    })}
                </Tr>
            </Thead>
            <Tbody>
                {props.body.map((value, index) => {
                    return <Tr key={index}>
                        {value.map((cellValue, cellIndex) => {
                            return <Td key={index + cellIndex}>{cellValue}</Td>
                        })}
                    </Tr>
                })}
            </Tbody>
        </Table>
    )
}