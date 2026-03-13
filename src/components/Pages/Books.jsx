import React, { useState } from "react";
import { useApp } from "../store.jsx";

const Books = () => {
  const { books, addBook, updateBook, deleteBook } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: 1,
  });

  // ================= FILTER BOOKS =================
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await updateBook(editingBook._id, formData);
      } else {
        await addBook(formData);
      }

      resetForm();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // ================= HANDLE EDIT =================
  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      quantity: book.quantity,
    });
    setShowModal(true);
  };

  // ================= HANDLE DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    await deleteBook(id);
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      quantity: 1,
    });

    setEditingBook(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Books Management
          </h1>
          <p className="text-gray-500">
            Manage your library's collection.
          </p>
        </div>
       {/* SEARCH BOX */}
       <div className="flex justify-end">
         <input
          type="text"
          placeholder="Search books..."
          className="border px-4 py-2 rounded-lg w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
         />
       </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Book
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Title / Author
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                ISBN
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Category
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase">
                Qty
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase">
                Avail
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book._id}>

                  <td className="px-6 py-4">
                    <div className="font-bold">{book.title}</div>
                    <div className="text-sm text-gray-500">
                      {book.author}
                    </div>
                  </td>

                  <td className="px-6 py-4">{book.isbn}</td>

                  <td className="px-6 py-4">
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">
                      {book.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {book.quantity}
                  </td>

                  <td className="px-6 py-4 text-center font-bold">
                    {book.available}
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">

                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="text-xl font-bold mb-4">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                required
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <input
                required
                placeholder="Author"
                className="w-full border p-2 rounded"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />

              <input
                required
                placeholder="ISBN"
                className="w-full border p-2 rounded"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
              />

              <input
                required
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />

              <input
                type="number"
                min="1"
                required
                className="w-full border p-2 rounded"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
              />

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-2 rounded"
              >
                {editingBook ? "Update Book" : "Save Book"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>

            </form>

          </div>

        </div>
      )}
    </div>
  );
};

export default Books;