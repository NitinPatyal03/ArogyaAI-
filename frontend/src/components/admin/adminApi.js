import toast from "react-hot-toast";

// -------------------------
// Fetch Users
// -------------------------
export const fetchUsers = async (setUsers) => {

  try {

    const response = await fetch(

      "https://arogyaai-backend-dic1.onrender.com/admin/users"

    );

    const data = await response.json();

    setUsers(data);

  }

  catch (err) {

    console.log(err);

    toast.error("Failed to load users");

  }

};

// -------------------------
// Fetch Appointments
// -------------------------
export const fetchAppointments = async (setAppointments) => {

  try {

    const response = await fetch(

      "https://arogyaai-backend-dic1.onrender.com/appointment"

    );

    const data = await response.json();

    setAppointments(data);

  }

  catch (err) {

    console.log(err);

  }

};

// -------------------------
// Fetch History
// -------------------------
export const fetchHistory = async (setHistory) => {

  try {

    const response = await fetch(

      "https://arogyaai-backend-dic1.onrender.com/history"

    );

    const data = await response.json();

    setHistory(data);

  }

  catch (err) {

    console.log(err);

  }

};

// -------------------------
// Delete User
// -------------------------
export const deleteUser = async (

  id,

  refresh

) => {

  if (

    !window.confirm(

      "Delete this user?"

    )

  )

    return;

  try {

    const response = await fetch(

      `https://arogyaai-backend-dic1.onrender.com/admin/delete-user/${id}`,

      {

        method: "DELETE"

      }

    );

    const data = await response.json();

    if (data.success) {

      toast.success("User Deleted");

      refresh();

    }

  }

  catch (err) {

    console.log(err);

    toast.error("Delete Failed");

  }

};

// -------------------------
// Block User
// -------------------------
export const blockUser = async (

  id,

  refresh

) => {

  try {

    const response = await fetch(

      `https://arogyaai-backend-dic1.onrender.com/admin/block-user/${id}`,

      {

        method: "PUT"

      }

    );

    const data = await response.json();

    if (data.success) {

      toast.success("User Blocked");

      refresh();

    }

  }

  catch (err) {

    console.log(err);

    toast.error("Server Error");

  }

};

// -------------------------
// Unblock User
// -------------------------
export const unblockUser = async (

  id,

  refresh

) => {

  try {

    const response = await fetch(

      `https://arogyaai-backend-dic1.onrender.com/admin/unblock-user/${id}`,

      {

        method: "PUT"

      }

    );

    const data = await response.json();

    if (data.success) {

      toast.success("User Activated");

      refresh();

    }

  }

  catch (err) {

    console.log(err);

    toast.error("Server Error");

  }

};

// -------------------------
// Update User
// -------------------------
export const updateUser = async (

  editUser,

  refresh,

  closeModal

) => {

  try {

    const response = await fetch(

      `https://arogyaai-backend-dic1.onrender.com/admin/update-user/${editUser._id}`,

      {

        method: "PUT",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify(editUser)

      }

    );

    const data = await response.json();

    if (data.success) {

      toast.success(

        "User Updated"

      );

      refresh();

      closeModal();

    }

  }

  catch (err) {

    console.log(err);

    toast.error(

      "Update Failed"

    );

  }

};