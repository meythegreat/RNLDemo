import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import FloatingLabelInput from "../components/Input/FloatingLabelInput";
import { useState } from "react";
import FloatingLabelSelect from "../components/Select/FloatingLabelSelect";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/Table";

const SampleComponent = () => {
  const [firstName,  setFirstName] = useState("");
  const [lastName,  setLastName] = useState("");
  const [birthDate,  setBirthDate] = useState("");
  const [password,  setPassword] = useState("");
  const [gender, setGender] = useState("");

  const genders = [
    {
        value: "", 
        text: "Select Gender"
    }, 
    { value: 1, 
    text: 'Male'
    },
    {
    value: 2,
    text: 'Female'
    },
    {
      value: 3,
      text: 'Prefer not to say'
    }
];

    return (
        <>
            <h1 className="text-red-600 mb-2 ">Welcome!</h1>
            <p className="text-gray-600 mb-8 text-sm italic">Please enter your details below:</p>
            <div className="mb-4">
            <FloatingLabelInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" name="first_name" required autoFocus />
            <p className="font-medium mt-2">First Name: {firstName}</p>
            </div>
            <div className="mb-4">
            <FloatingLabelInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" name="last_name" required />
            <p className="font-medium mt-2">Last Name: {lastName}</p>
            </div>
            <div className="mb-4">
            <FloatingLabelInput label="Birth Date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="date" name="birth_date" />
            <p className="font-medium mt-2">Birth Date: {birthDate}</p>
            </div>
            <div className="mb-4">
            <FloatingLabelInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" />
            <p className="font-medium mt-2">Password: {password}</p>
            </div>
            <div className="mb-4">
              <FloatingLabelSelect label="Gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                {genders.map((gender, index) => (
                  <option value={gender.value} key={index}>
                    {gender.text}
                  </option>
                ))}
              </FloatingLabelSelect>
              <p className="font-medium mt-2">Gender: {gender}</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 bg-blue-600 text-white sticky top-0 z-30 text-xs">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-start">Gender</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {genders.map((gender, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-center">{gender.value}</TableCell>
                        <TableCell className="px-4 py-3 text-start">{gender.text}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
        </>
    )
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<SampleComponent />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes