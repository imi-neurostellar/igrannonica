using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MiniApkSonja.Models
{
    public class Student
    {
        public int id;
        public string firstName;
        public string lastName;
        public string regNum;
        public string address;
        public string phoneNum;
        public double gpa;

        public Student(int id, string firstName, string lastName, string regNum, string address, string phoneNum, double gpa)
        {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.regNum = regNum;
            this.address = address;
            this.phoneNum = phoneNum;
            this.gpa = gpa;
        }
        public override string ToString()
        {
            return id + " " + firstName + " " + lastName + " " + regNum + " " + address + " " + phoneNum + " " + gpa;
        }
    }
}
