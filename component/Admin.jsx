import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Admin() {
  const { token } = useParams();
  const [blog, setBlog] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [idEmployee, setIdEmployee] = useState("");
  const [switchButton, setSwictButton] = useState(false);
  const [formEmployee, setFormEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    position: "",
    department: "",
    salary: "",
    hired_at: "",
    emergency_contact: "",
    nationality: "",
    gender: "",
    marital_status: "",
    notes: "",
    is_visible: true,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/blog", {
          headers: {
            Authorization: `Bearer ${token}`, // ใช้ token ใน header
          },
        });
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchBlog();
  }, [token]);

  const handleEdit = async (id) => {
    const response = await fetch(`http://localhost:8000/api/blog/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json(); // ใช้ await เพื่อรอให้ response.json() เสร็จ
    // setFormEmployee(data); // จากนั้นค่อย set ค่า formEmployee
    // setShowForm(true); // แสดงฟอร์มแก้ไข
    // setIdEmployee(id);
    // setSwictButton(true);
  };

  const handleDelete = async (id) => {
    window.confirm("Do you want delete it?");
    const response = await fetch(`http://localhost:8000/api/blog/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEmployee({ ...formEmployee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formEmployee),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Employee created successfully:", data);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/blog/${idEmployee}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formEmployee),
        }
      );
      setShowForm(false);
      setSwictButton(false);
      // window.location.reload();
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const showAdd = () => {
    setShowForm((prevShow) => !prevShow);
    setFormEmployee("");
    setSwictButton(false);
  };

  //active
  const toggleVisibility = async (id) => {
    try {
      // หา employee ที่จะถูกสลับค่าใน employees list
      const employeeToToggle = employees.find((employee) => employee.id === id);

      // ตรวจสอบว่าพบ employee ที่ต้องการหรือไม่ก่อนดำเนินการ
      if (!employeeToToggle) {
        throw new Error("Employee not found");
      }

      // ส่งคำขอไปที่ API เพื่ออัปเดตค่า is_visible ของ employee
      const response = await fetch(`http://localhost:8000/api/employee/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // ส่งข้อมูลที่ต้องการอัปเดตไปยัง API
          is_visible: !employeeToToggle.is_visible, // สลับค่า is_visible: ถ้าเป็น true ก็เปลี่ยนเป็น false และกลับกัน
        }),
      });

      // ตรวจสอบว่า API ตอบกลับมาด้วยข้อมูลที่ถูกต้องหรือไม่
      if (!response.ok) {
        throw new Error("Failed to update employee visibility");
      }

      // แปลงข้อมูลที่ได้จาก API จาก JSON เป็น JavaScript object
      const updatedEmployee = await response.json();

      // อัปเดตสถานะ employees ใน React state ด้วยข้อมูลใหม่จาก API
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          // ถ้า employee.id ตรงกับ id ที่ส่งไปอัปเดต ก็จะใช้ข้อมูลที่อัปเดตแล้ว (updatedEmployee) มาแทน
          employee.id === id
            ? { ...employee, is_visible: updatedEmployee.is_visible } // อัปเดตฟิลด์ is_visible จากข้อมูลที่ได้จาก API
            : employee // ถ้าไม่ตรงกับ id ที่ส่งไป ก็คืนค่า employee เดิมๆ
        )
      );
    } catch (error) {
      // ถ้ามีข้อผิดพลาด จะแสดงข้อผิดพลาดใน console
      console.error("Error toggling visibility:", error);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-4">บทความทั้งหมด</h1>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">title</th>
            <th className="py-2 px-4 border-b">content</th>
            <th className="py-2 px-4 border-b">status</th>
            <th className="py-2 px-4 border-b">edit</th>
            <th className="py-2 px-4 border-b">delete</th>
            <th className="py-2 px-4 border-b">Author</th>
            <th className="py-2 px-4 border-b">category</th>
          </tr>
        </thead>
        <tbody>
          {blog.map((val) => (
            <tr key={val.id}>
              <td className="py-2 px-4 border-b">{val.id}</td>
              <td className="py-2 px-4 border-b">{val.title}</td>
              <td className="py-2 px-4 border-b">{val.content}</td>
              <td className="py-2 px-4 border-b"><button
                  onClick={() => toggleVisibility(val.id)}
                  className={`${val.is_visible ? "bg-red-500" : "bg-green-500"
                    } hover:bg-opacity-75 text-white font-bold py-1 px-2 rounded mr-2`}
                >
                  {val.is_visible ? "Hide" : "Show"}
                </button></td>
              <td className="py-2 px-4 border-b"><button
                  onClick={() => handleEdit(val.id)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button></td>
              <td className="py-2 px-4 border-b"><button
                  onClick={() => handleDelete(val.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button></td>

              <td className="py-2 px-4 border-b">{val.author}</td>
              <td className="py-2 px-4 border-b">{val.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}