using SIBack.Interfaces;
using SIBack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIBack.Data
{
    public class MockLaptopData : ILaptopData
    {
        //pravi se lista laptopova iz baze
        //
        private DatabaseConn _dbContext;

        public MockLaptopData(DatabaseConn dbContext)
        {
            _dbContext = dbContext;
        }

        public Laptop AddLaptop(Laptop laptop)
        {
            Laptop l = new Laptop();
            l.brand = laptop.brand;
            l.model = laptop.model;
            l.display = laptop.display;
            l.graphics = laptop.graphics;
            l.hdd = laptop.hdd;
            l.processor = laptop.processor;
            l.ram = laptop.ram;
            l.price = laptop.price;
            l.id = new Guid();

            _dbContext.Laptops.Add(l);
            _dbContext.SaveChanges();
            
            return l;
        }

        public void DeleteLaptop(Laptop laptop)
        { 
            _dbContext.Laptops.Remove(laptop);
            _dbContext.SaveChanges();
        }

        public Laptop EditLaptop(Laptop laptop)
        {
            Laptop l = _dbContext.Laptops.Where(l => l.id == laptop.id).FirstOrDefault();

            if (l != null)
            {
                l.brand = laptop.brand;
                l.model = laptop.model;
                l.display = laptop.display;
                l.graphics = laptop.graphics;
                l.hdd = laptop.hdd;
                l.processor = laptop.processor;
                l.ram = laptop.ram;
                l.price = laptop.price;

                _dbContext.Laptops.Update(l);
                _dbContext.SaveChanges();
            }

            return l;
        }

        public Laptop GetLaptop(Guid id)
        {
            Laptop l = _dbContext.Laptops.Where(l => l.id == id).FirstOrDefault();

            return l;
        }

        public List<Laptop> GetLaptops()
        {
            List<Laptop> laptops = _dbContext.Laptops.ToList();

            laptops.Reverse();

            return laptops;

        }
    }
}
