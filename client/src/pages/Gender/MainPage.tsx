import { useEffect } from "react";
import AddGender from "./components/AddGenderForm";
import GenderList from "./components/GenderList";

const MainPage = () => {
  useEffect (() =>{
    document.title = "Gender Main Page";
  }, [])
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Add Gender Form */}
      <div className="col-span-2 md:col-span-1">
        <AddGender />
      </div>

      {/* Gender List */}
      <div className="col-span-2 md:col-span-1">
        <GenderList />
      </div>
    </div>
  );
};

export default MainPage;