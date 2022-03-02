using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SQLite;
using MiniApkSonja.Models;

namespace MiniApkSonja
{
    public class StudentsDb
    {
        SQLiteConnection _connection = DatabaseConnection.Connection;

        internal List<Student> getAllStudents()
        {
            List<Student> students = new List<Student>();

            _connection.Open();

            SQLiteCommand cmd = new SQLiteCommand();
            cmd.Connection = _connection;
            cmd.CommandText = @"select * from studenti";

            SQLiteDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                students.Add(new Student(
                        int.Parse(reader["id"].ToString()),
                        reader["firstName"].ToString(),
                        reader["lastName"].ToString(),
                        reader["regNum"].ToString(),
                        reader["address"].ToString(),
                        reader["phoneNum"].ToString(),
                        double.Parse(reader["gpa"].ToString())
                    ));
            }
            reader.Close();

            _connection.Close();

            return students;
        }

        internal void addStudent(Student student)
        {
            _connection.Open();

            SQLiteCommand cmd = new SQLiteCommand();
            cmd.Connection = _connection;
            cmd.CommandText = @"insert into studenti(firstName,lastName,regNum,address,phoneNum,gpa) values(@firstName, @lastName, @regNum, @address, @phoneNum, @gpa)";
            cmd.Parameters.AddWithValue("@id", student.id);
            cmd.Parameters.AddWithValue("@firstName", student.firstName);
            cmd.Parameters.AddWithValue("@lastName", student.lastName);
            cmd.Parameters.AddWithValue("@regNum", student.regNum);
            cmd.Parameters.AddWithValue("@address", student.address);
            cmd.Parameters.AddWithValue("@phoneNum", student.phoneNum);
            cmd.Parameters.AddWithValue("@gpa", student.gpa);

            cmd.ExecuteNonQuery();

            _connection.Close();
        }

        internal Student getStudentById(int id)
        {
            Student student = null;

            _connection.Open();

            SQLiteCommand cmd = new SQLiteCommand();
            cmd.Connection = _connection;
            cmd.CommandText = @"select * from studenti where id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            SQLiteDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                student = new Student(
                        int.Parse(reader["id"].ToString()),
                        reader["firstName"].ToString(),
                        reader["lastName"].ToString(),
                        reader["regNum"].ToString(),
                        reader["address"].ToString(),
                        reader["phoneNum"].ToString(),
                        double.Parse(reader["gpa"].ToString())
                    );
            }
            reader.Close();

            _connection.Close();

            return student;
        }

        internal void updateStudentInfo(Student student)
        {
            _connection.Open();

            SQLiteCommand cmd = new SQLiteCommand();
            cmd.Connection = _connection;
            cmd.CommandText = @"update studenti set firstName=@firstName, lastName=@lastName, regNum=@regNum, address=@address, phoneNum=@phoneNum, gpa=@gpa where id=@id";
            cmd.Parameters.AddWithValue("@id", student.id);
            cmd.Parameters.AddWithValue("@firstName", student.firstName);
            cmd.Parameters.AddWithValue("@lastName", student.lastName);
            cmd.Parameters.AddWithValue("@regNum", student.regNum);
            cmd.Parameters.AddWithValue("@address", student.address);
            cmd.Parameters.AddWithValue("@phoneNum", student.phoneNum);
            cmd.Parameters.AddWithValue("@gpa", student.gpa);

            cmd.ExecuteNonQuery();

            _connection.Close();
        }

        internal void deleteStudentById(int id)
        {
            _connection.Open();

            SQLiteCommand cmd = new SQLiteCommand();
            cmd.Connection = _connection;
            cmd.CommandText = @"delete from studenti where id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();

            _connection.Close();
        }

    }
}
