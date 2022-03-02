using SIBack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIBack.Interfaces
{
    public interface ILaptopData
    {
        List<Laptop> GetLaptops();

        
        Laptop AddLaptop(Laptop laptop);
        Laptop GetLaptop(Guid id);
        Laptop EditLaptop(Laptop laptop);
        void DeleteLaptop(Laptop laptop);
    }
}
