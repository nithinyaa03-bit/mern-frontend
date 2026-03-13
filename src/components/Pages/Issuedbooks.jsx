import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useApp } from "../store.jsx";

const Issuedbooks = () => {
  const {
    issues,
    students,
    teachers,
    books,
    issueBook,
    returnBook,
    fetchIssues
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const defaultDueDate = new Date(Date.now() + 86400000 * 7)
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState({
    borrowerType: "student",
    student: "",
    teacher: "",
    book: "",
    dueDate: defaultDueDate
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const resetForm = () => {
    setFormData({
      borrowerType: "student",
      student: "",
      teacher: "",
      book: "",
      dueDate: defaultDueDate
    });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      book: formData.book,
      dueDate: formData.dueDate,
      student: formData.borrowerType === "student" ? formData.student : null,
      teacher: formData.borrowerType === "teacher" ? formData.teacher : null
    };

    await issueBook(payload);
    await fetchIssues();
    resetForm();
  };

  const handleReturn = async (id) => {
    await returnBook(id);
    await fetchIssues();
  };

  const issuedBooks = issues
    .filter((issue) => issue.status === "issued")
    .filter((issue) => {
      const borrower =
        issue.student?.name || issue.teacher?.name || "";

      return (
        issue.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
        borrower.toLowerCase().includes(search.toLowerCase())
      );
    });

  /* SEARCHABLE BOOK OPTIONS */

  const bookOptions = books
    .filter((b) => b.quantity > 0)
    .map((b) => ({
      value: b._id,
      label: `${b.title} (${b.quantity} left)`
    }));

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Issued Books
          </h1>
          <p className="text-gray-500">
            Track current book loans and handle returns.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by book or borrower..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg"
        >
          Issue a Book
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Book / Borrower
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Issue Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Due Date
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {issuedBooks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No issued books
                </td>
              </tr>
            )}

            {issuedBooks.map((issue) => {

              const borrower =
                issue.student?.name || issue.teacher?.name || "Unknown";

              return (
                <tr key={issue._id}>

                  <td className="px-6 py-4">
                    <div className="font-bold">
                      {issue.book?.title}
                    </div>
                    <div className="text-sm text-indigo-600">
                      {borrower}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(issue.issueDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                      issued
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleReturn(issue._id)}
                      className="bg-amber-500 text-white px-3 py-1 rounded-lg"
                    >
                      Return
                    </button>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white rounded-xl p-6 w-[420px]">

            <h3 className="text-xl font-bold mb-4">
              Issue New Book
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <select
                value={formData.borrowerType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    borrowerType: e.target.value
                  })
                }
                className="w-full border p-2 rounded"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>

              {formData.borrowerType === "student" && (
                <select
                  required
                  value={formData.student}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      student: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Student</option>

                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              {formData.borrowerType === "teacher" && (
                <select
                  required
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teacher: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Teacher</option>

                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}

              {/* SEARCHABLE BOOK SELECT */}

              <Select
                placeholder="Search Book..."
                options={bookOptions}
                onChange={(selected) =>
                  setFormData({ ...formData, book: selected.value })
                }
              />

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/2 bg-gray-200 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 bg-amber-600 text-white py-2 rounded"
                >
                  Confirm Issue
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Issuedbooks;