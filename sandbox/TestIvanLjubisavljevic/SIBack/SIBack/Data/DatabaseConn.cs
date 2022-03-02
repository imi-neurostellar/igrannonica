using Microsoft.EntityFrameworkCore;
using SIBack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace SIBack.Data
{
    public class DatabaseConn : DbContext
    {
        public DatabaseConn(DbContextOptions<DatabaseConn> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //da l treba
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        public DatabaseConn()
        {
        }

        public DbSet<Laptop> Laptops { get; set; }


    }
}
