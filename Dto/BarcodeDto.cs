using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class BarcodeDto
    {
        public int id { get; set; }
        public int itemId { get; set; }
        public string barcode { get; set; }
    }
}
