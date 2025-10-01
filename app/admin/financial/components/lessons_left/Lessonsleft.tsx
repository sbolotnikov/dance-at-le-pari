import React, { useEffect, useState } from 'react';

type Props = {};

type Customer = {
  _id: number;
  name: string;
  email: string;
};
interface Invoice {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  totalLessons: number;
  totalGroups: number;
}
export const Lessonsleft = (props: Props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableValues, setTableValues] = useState<
    {
      studentId: string;
      studentName: string;
      date: string;
      totalLessons: number;
      totalGroups: number;
      lessonsDone: number;
      lessonsLeft: number;
    }[]
  >([]);
  const [lessonsTaught, setLessonsTaught] = useState<
    { id: number; date: string; length: number; studentid: string }[]
  >([]);
  const lessonLength = 45; // in minutes
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/schedule');
        if (response.ok) {
          const lessonsData = await response.json();
          const lessonsArray = lessonsData
            .filter(
              (lesson: any) =>
                lesson.studentid.length == 1 &&
                lesson.confirmed === true &&
                lesson.eventtype === 'Private'
            )
            .map((lesson: any) => ({
              id: lesson.id,
              date: lesson.date,
              length: lesson.length / lessonLength,
              studentid: lesson.studentid[0].toString(),
            }));
          // Process lessonsData as needed
          console.log('Fetched lessons data:', lessonsArray);
          setLessonsTaught(lessonsArray);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/admin/invoices');
        if (response.ok) {
          const invoicesData = await response.json();
          const mappedInvoices = invoicesData.map((invoice: any) => {
            const totalLessons = invoice.sessions.reduce(
              (sum: number, session: any) => {
                return (
                  sum +
                  (session.sessionType === 'Private'
                    ? session.numberOfSessions
                    : 0)
                );
              },
              0
            );
            const totalGroups = invoice.sessions.reduce(
              (sum: number, session: any) => {
                return (
                  sum +
                  (session.sessionType === 'Group'
                    ? session.numberOfSessions
                    : 0)
                );
              },
              0
            );
            return {
              id: invoice.id,
              studentName: invoice.customer?.name || 'N/A',
              studentId: invoice.customer?.id || 'N/A',
              date: new Date(invoice.effectiveDate).toLocaleString('sv-SE', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }),
              totalLessons: totalLessons,
              totalGroups: totalGroups,
            };
          });
          setInvoices(mappedInvoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices().then(() => {
      fetchLessons().then(() => {
        setLoading(false);
      });
    });
  }, []);
  useEffect(() => {
    // This effect runs when lessonsTaught changes
    if (lessonsTaught.length === 0 || invoices.length === 0) return;
    const tableValuesLocal: {
      studentId: string;
      studentName: string;
      date: string;
      totalLessons: number;
      totalGroups: number;
      lessonsDone: number;
      lessonsLeft: number;
    }[] = [];
    const totalsByStudent = Object.values(
      invoices.reduce((acc, invoice) => {
        const { studentId, totalLessons, totalGroups, studentName, date } =
          invoice;

        if (!acc[studentId]) {
          acc[studentId] = {
            studentId,
            studentName: studentName || 'N/A',
            date: date || '',
            totalAmount: 0,
            totalLessons: 0,
            totalGroups: 0,
          };
        }
        acc[studentId].totalLessons += totalLessons;
        acc[studentId].totalGroups += totalGroups;
        acc[studentId].studentName = studentName || acc[studentId].studentName;
        acc[studentId].date =
          date < acc[studentId].date ? date : acc[studentId].date;
        return acc;
      }, {} as Record<string, { studentId: string; studentName: string; date: string; totalAmount: number; totalLessons: number; totalGroups: number }>)
    );

    totalsByStudent.forEach((student) => {
      const lessonsDone = lessonsTaught
        .filter(
          (lesson) =>
            parseInt(lesson.studentid) === parseInt(student.studentId) &&
            student.date + 'T23:59' <= lesson.date
        )
        .reduce((sum, lesson) => sum + lesson.length, 0);

      tableValuesLocal.push({
        studentId: student.studentId,
        studentName: student.studentName,
        date: student.date,
        totalLessons: student.totalLessons,
        totalGroups: student.totalGroups,
        lessonsDone, 
        lessonsLeft: student.totalLessons - lessonsDone
      });
    });
    setTableValues(tableValuesLocal);
  }, [lessonsTaught, invoices]);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-lightMainColor dark:text-darkMainColor">
          Lessons Left
        </h2>
      </div>
      {loading ? (
        <p>Loading invoices...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-lightMainBG dark:bg-darkMainBG">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Student Name
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Date
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Total Lessons Bought
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Total Lessons Taught
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Lessons Left
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Total Groups Bought
                </th>
              </tr>
            </thead>
            <tbody>
              {tableValues &&
                tableValues.map((row) => (
                  <tr
                    key={row.studentId}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                      {row.studentName}
                    </td>
                    <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                      {row.date}
                    </td>
                    <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                      {row.totalLessons || 0}
                    </td>
                    <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                      {row.lessonsDone || 0}
                    </td>
                    <td className={`py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor ${row.lessonsLeft < 0 ? 'bg-alertcolor' : ''} text-lightMainColor dark:text-darkMainColor text-left`}>
                      {row.lessonsLeft || 0}
                    </td>
                    <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor flex space-x-2">
                      {row.totalGroups || 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
