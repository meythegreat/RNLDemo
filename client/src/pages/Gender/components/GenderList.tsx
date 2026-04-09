import { Link } from "react-router-dom"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table"

const GenderList = () => {
    const genders = [
    {
        gender_id: 1,
        gender: 'Male',
        action: (
            <div className="flex items-center justify-center gap-3">
                <Link to='/gender/edit/' className="text-green-600 hover:text-green-700 hover:underline font-medium">
                    Edit
                </Link>
                <Link to='/gender/delete/' className="text-red-600 hover:text-red-700 hover:underline font-medium">
                    Delete
                </Link>
            </div>
        ),
    },
    {
        gender_id: 2,
        gender: 'Female',
        action: (
            // Both links combined into one flex container
            <div className="flex items-center justify-center gap-3">
                <Link to='/gender/edit/' className="text-green-600 hover:text-green-700 hover:underline font-medium">
                    Edit
                </Link>
                <Link to='/gender/delete/' className="text-red-600 hover:text-red-700 hover:underline font-medium">
                    Delete
                </Link>
            </div>
        ),
    },
    {
        gender_id: 3,
        gender: 'Other',
        action: (
            // Both links combined into one flex container
            <div className="flex items-center justify-center gap-3">
                <Link to='/gender/edit/' className="text-green-600 hover:text-green-700 hover:underline font-medium">
                    Edit
                </Link>
                <Link to='/gender/delete/' className="text-red-600 hover:text-red-700 hover:underline font-medium">
                    Delete
                </Link>
            </div>
        ),
    },
    ] // End of genders array
    
    return (
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
                            <TableRow> 
                                <TableCell className="px-5 py-3 font-medium text-center">No.</TableCell>
                                <TableCell className="px-5 py-3 font-medium text-center">Gender</TableCell>
                                <TableCell className="px-5 py-3 font-medium text-center">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm" >
                            {genders.map((gender, index) => (
                                <TableRow className="hover:bg-gray-100" key={index}>
                                    <TableCell className="px-4 py-3 text-center">{gender.gender_id}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">{gender.gender}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">{gender.action}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default GenderList