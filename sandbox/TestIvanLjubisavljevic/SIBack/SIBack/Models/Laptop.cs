using System;
using System.ComponentModel.DataAnnotations;

namespace SIBack.Models
{
    public class Laptop
    {
        [Key]
        public Guid id { get; set; }
        
        public string brand { get; set; }
        public string model { get; set; }
        public int ram { get; set; }
        public string graphics { get; set; }
        public int hdd { get; set; }
        public string processor { get; set; }
        public string display { get; set; }
        public double price { get; set; }

        
    }
}
