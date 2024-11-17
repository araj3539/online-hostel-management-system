import React from 'react';
import useStore from '../../store/useStore';

const ManageStudents = () => {
  const users = useStore(state => state.users);
  const rooms = useStore(state => state.rooms);
  const payments = useStore(state => state.payments);

  const students = users.filter(user => user.role === 'student');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Students</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-4">Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Room</th>
                <th className="pb-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => {
                const studentPayments = payments.filter(p => p.studentId === student.id);
                const latestPayment = studentPayments[studentPayments.length - 1];
                const studentRoom = rooms.find(room => 
                  payments.some(p => p.roomId === room.id && p.studentId === student.id)
                );

                return (
                  <tr key={student.id}>
                    <td className="py-4">
                      {student.fullName || student.username}
                    </td>
                    <td className="py-4">{student.email}</td>
                    <td className="py-4">
                      {studentRoom ? `Room ${studentRoom.number}` : 'Not assigned'}
                    </td>
                    <td className="py-4">
                      {latestPayment ? (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            latestPayment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {latestPayment.status}
                        </span>
                      ) : (
                        <span className="text-gray-500">No payments</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;