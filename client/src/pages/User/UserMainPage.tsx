import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import AddUserFormModal from "./components/AddUserFormModal";
import DeleteUserFormModal from "./components/DeleteUserFormModal";
import EditUserFormModal from "./components/EditUserFormModal";
import UserList from "./components/UserList";

const UserMainPage = () => {
    const {isOpen: isAddUserFormModalOpen, openModal: openAddUserFormModal, closeModal: closeAddUserFormModal} = useModal(false);

    const {isOpen: isEditUserFormModalOpen, selectedUser: selectedUserForEdit, openModal: openEditUserFormModal, closeModal: closeEditUserFormModal} = useModal(false);

    const {isOpen: isDeleteUserFormModalOpen, selectedUser: selectedUserForDelete, openModal: openDeleteUserFormModal, closeModal: closeDeleteUserFormModal} = useModal(false);
    
    const {
        message: toastMessage,
        isFailed: toastMessageIsFailed,
        isVisible: toastMessageIsVisible,
        showToastMessage,
        closeToastMessage
    } = useToastMessage('', false, false);
    
    const {refresh, handleRefresh} = useRefresh(false);

  return (
    <>
        <ToastMessage
            message={toastMessage}
            isFailed={toastMessageIsFailed}
            isVisible={toastMessageIsVisible}
            onClose={closeToastMessage}
            className="fixed top-6 right-6"
        />
        <AddUserFormModal
            onUserAdded={showToastMessage}
            isOpen={isAddUserFormModalOpen}
            onClose={closeAddUserFormModal}
            refreshKey={handleRefresh}
        />
        <EditUserFormModal 
            user={selectedUserForEdit} 
            onUserUpdated={showToastMessage} 
            refreshKey={handleRefresh} 
            isOpen={isEditUserFormModalOpen} 
            onClose={closeEditUserFormModal}
        />
        <DeleteUserFormModal 
          user={selectedUserForDelete}
          onUserDeleted={showToastMessage}
          refreshKey={handleRefresh}
          isOpen={isDeleteUserFormModalOpen}
          onClose={closeDeleteUserFormModal}
        />
        <UserList 
            onAddUser={openAddUserFormModal} 
            onEditUser={(user) => openEditUserFormModal(user)}
            onDeleteUser={(user) => openDeleteUserFormModal(user)} 
            refreshKey={refresh}
        />
    </>
  )
}

export default UserMainPage;
