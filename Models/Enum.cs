using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace SB.Models
{
    public partial class EnumTable
    {
        public string Class { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }

        [NotMapped]
        public string ClassType { get; set; }
        [NotMapped]
        public string ShortName { get; set; }
        [NotMapped]
        public bool? Updated { get; set; }
    }
}
