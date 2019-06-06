using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class FilterDto
    {
        public int? BranchId { get; set; } 
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

    }
}
