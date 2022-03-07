using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class User
    {
        [Key]
        public Guid userId { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }


        public string firstName { get; set; }
        public int lastName { get; set; }
        
    }
}
