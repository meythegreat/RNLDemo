import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import UserService from "../../../services/UserService";
import Spinner from "../../../components/Spinner/Spinner";
import type { UserColumns } from "../../../interfaces/UserInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: UserColumns | null) => void;
    onDeleteUser: (user: UserColumns | null) => void;
    refreshKey: boolean;
}

const UserList: FC<UserListProps> = ({onAddUser, onEditUser, onDeleteUser, refreshKey}) => {
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState<UserColumns[]>([]);
    const [usersTableCurrentPage, setUsersTableCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const tableRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLTableRowElement>(null);
    const latestRequestRef = useRef(0);

    const handleLoadUsers = useCallback(async (page: number, searchValue: string, append = false) => {
        const requestId = ++latestRequestRef.current;

        try {
            setLoadingUsers(true);

            const res = await UserService.loadUsers(page, searchValue);

            if(requestId !== latestRequestRef.current) {
                return;
            }

            if(res.status === 200) {
                const usersData = res.data.users.data || res.data.users || [];
                const lastPage = res.data.users.last_page || res.data.last_page || 1;

                setUsers((currentUsers) => append ? [...currentUsers, ...usersData] : usersData);
                setUsersTableCurrentPage(page);
                setHasMore(page < lastPage);
            } else {
                if(!append) {
                    setUsers([]);
                }
                setHasMore(false);
            }
        } catch(error) {
            console.error('Unexpected server error occurred during loading of users: ', error);
        } finally {
            if(requestId === latestRequestRef.current) {
                setLoadingUsers(false);
            }
        }
    }, []);

    const handleUserFullNameFormat = (user: UserColumns) => {
        let fullName = ''

        if(user.middle_name) {
            fullName = `${user.last_name}, ${user.first_name} ${user.middle_name.charAt(0)}.`;
        } else {
            fullName = `${user.last_name}, ${user.first_name}`;
        }

        // Doe, John

        if(user.suffix_name) {
            fullName += ` ${user.suffix_name}`;
        }

        // Doe, John Jr.

        return fullName;
    };

    useEffect(() => {
        const target = loadMoreRef.current;

        if(!target) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if(entry?.isIntersecting && hasMore && !loadingUsers) {
                    handleLoadUsers(usersTableCurrentPage + 1, debouncedSearch, true);
                }
            },
            {
                root: tableRef.current,
                rootMargin: '0px 0px 120px 0px',
                threshold: 0.1
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [handleLoadUsers, hasMore, loadingUsers, search, usersTableCurrentPage, users.length]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 800)

        return () => clearTimeout(timer)
    }, [search])

    useEffect(()=> {
        setUsers([]);
        setUsersTableCurrentPage(1);
        setHasMore(true);
        handleLoadUsers(1, debouncedSearch, false);
    }, [refreshKey, handleLoadUsers, debouncedSearch]);
  
    return (
    <>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div ref={tableRef} className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto overflow-y-auto">
            <Table>
                <caption className="mb-4">
                    <div className="border-b border-gray-100">
                        <div className="p-4 flex justify-between">
                            <div className="w-64">
                                <FloatingLabelInput label="Search" type="text" name="search" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
                            </div>
                            <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer" onClick={onAddUser}>
                                Add User
                            </button>
                        </div>
                    </div>
                </caption>
                <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
                    <TableRow> 
                        <TableCell isHeader className="px-5 py-3 text-center">No.</TableCell>
                        <TableCell isHeader className="px-5 py-3 text-start">Full Name</TableCell>
                        <TableCell isHeader className="px-5 py-3 text-center">Gender</TableCell>
                        <TableCell isHeader className="px-5 py-3 text-center">Birthdate</TableCell>
                        <TableCell isHeader className="px-5 py-3 text-center">Age</TableCell>
                        <TableCell isHeader className="px-5 py-3 text-center w-30">Actions</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm" >
                    {loadingUsers && users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="px-5 py-3 text-center">
                                <Spinner size="md" />
                            </TableCell>
                        </TableRow>
                    ) : users.length > 0 ? (
                        users.map((user, index) => (
                            <TableRow className="hover:bg-gray-100" key={user.user_id}>
                                <TableCell className="px-5 py-3 text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-start">
                                    {handleUserFullNameFormat(user)}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    {user.gender.gender}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    {user.birth_date}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    {user.age}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    <div className="flex gap-4">
                                        <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline" onClick={() => onEditUser(user)}>Edit</button>
                                        <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline" onClick={() => onDeleteUser(user)}>Delete</button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))

                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="px-5 py-3 text-center font-medium">
                                {search ? 'No users matched your search.' : 'No users found.'}
                            </TableCell>
                        </TableRow>
                    )}
                    {hasMore && users.length > 0 && (
                        <tr ref={loadMoreRef}>
                            <TableCell colSpan={6} className="h-1 p-0">{''}</TableCell>
                        </tr>
                    )}
                    {loadingUsers && users.length > 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="px-5 py-3 text-center">
                                <Spinner size="md" />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </div>
    </>
  );
};

export default UserList
