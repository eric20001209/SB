using System;
using System.Collections.Generic;

namespace SB.Models
{
    public partial class EnumTable
    {
        public string Class { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string ClassType { get; set; }
        public string ShortName { get; set; }
        public bool? Updated { get; set; }
    }
}
