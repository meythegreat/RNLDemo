import { useModal } from "../../hooks/useModal";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddUserFormModal from "./components/AddUserFormModal";
import UserList from "./components/UserList";

const UserMainPage = () => {
    const {isOpen, openModal, closeModal} = useModal(false);
    const {message: toastMessage, isVisible: toastMessageIsVisible, showToastMessage, closeToastMessage} = useToastMessage('', false);
  return (
    <>
        <AddUserFormModal
            onUserAdded={showToastMessage}
            toastMessage={toastMessage}
            toastMessageIsVisible={toastMessageIsVisible}
            onCloseToastMessage={closeToastMessage}
            isOpen={isOpen}
            onClose={closeModal}
        />
        <UserList onAddUser={openModal} />
    </>
  )
}

export default UserMainPage;
