import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface UserListProps {
    onAddUser: () => void;
}

const UserList: FC<UserListProps> = ({onAddUser}) => {
    const users = [
        {
            user_id: 1,
            first_name: 'John',
            middle_name: '',
            last_name: 'Doe',
            suffix_name: '',
            gender: 'Male',
            address: 'Salocon, Panitan, Capiz',
            action: (
                <>
                <div className="flex gap-4">
                    <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline">Edit</button>
                    <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline">Delete</button>
                </div>
                </>
            )
        },
        {
            user_id: 2,
            first_name: 'Herminio Jose',
            middle_name: 'Lualhati',
            last_name: 'Alcasid',
            suffix_name: 'Jr.',
            gender: 'Male',
            address: 'Pasay City',
            action: (
                <>
                <div className="flex gap-4">
                    <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline">Edit</button>
                    <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline">Delete</button>
                </div>
                </>
            )
        },
        {
            user_id: 3,
            first_name: 'Jose Marie',
            middle_name: 'Borja',
            last_name: 'Viceral',
            suffix_name: '',
            gender: 'Prefer not to say',
            address: 'Metro Manila',
            action: (
                <>
                <div className="flex gap-4">
                    <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline">Edit</button>
                    <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline">Delete</button>
                </div>
                </>
            )
        },
    ]
  
    return (
    <>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
            <Table>
                <caption className="mb-4">
                    <div className="border-b border-gray-100">
                        <div className="p-4 flex justify-end">
                            <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer" onClick={onAddUser}>
                                Add User
                            </button>
                        </div>
                    </div>
                </caption>
                <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
                    <TableRow> 
                        <TableCell className="px-5 py-3 font-medium text-center">No.</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">First Name</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">Middle Name</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">Last Name</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">Suffix Name</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">Gender</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">Address</TableCell>
                        <TableCell className="px-5 py-3 font-medium text-center">Actions</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm" >
                    {users.map((user, index) => (
                        <TableRow className="hover:bg-gray-100" key={index}>
                            <TableCell className="px-4 py-3 text-center">{user.user_id}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.first_name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.middle_name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.last_name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.suffix_name}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.gender}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.address}</TableCell>
                            <TableCell className="px-4 py-3 text-center">{user.action}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
    </>
  );
};

export default UserList
