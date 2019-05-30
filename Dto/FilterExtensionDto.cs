using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public static class FilterExtensionDto
    {
        //today
        public static FilterDto today(this FilterDto myfilter)
        {
            myfilter.Start = DateTime.Today.Date;
            myfilter.End = DateTime.Today.Date.AddDays(1);
            return myfilter;
        }

        //yesterday
        public static FilterDto yesterday(this FilterDto myfilter)
        {
            myfilter.Start = DateTime.Today.Date.AddDays(-1);
            myfilter.End = DateTime.Today.Date;
            return myfilter;
        }

        //last 7days
        public static FilterDto seven_days(this FilterDto myfilter)
        {
            myfilter.Start = DateTime.Today.Date.AddDays(-6);
            myfilter.End = DateTime.Today.Date;
            return myfilter;
        }

        //last 30 days
        public static FilterDto thirty_days(this FilterDto myfilter)
        {
            myfilter.Start = DateTime.Today.Date.AddDays(-29);
            myfilter.End = DateTime.Today.Date;
            return myfilter;
        }

        //this week
        public static FilterDto this_week(this FilterDto myfilter)
        {
            myfilter.Start = DateTime.Now.Date.AddDays(-(int)DateTime.Now.DayOfWeek);
            myfilter.End = DateTime.Now.Date.AddDays(1);
            return myfilter;
        }

        //last week
        public static FilterDto last_week(this FilterDto filter)
        {
            filter.Start = DateTime.Now.Date.AddDays(-(int)DateTime.Now.DayOfWeek - 7);
            filter.End = DateTime.Now.Date.AddDays(-(int)DateTime.Now.DayOfWeek);

            return filter;
        }

        // this month
        public static FilterDto this_month(this FilterDto filter)
        {
            filter.Start = DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1);
            filter.End = DateTime.Now.Date.AddDays(1);

            return filter;
        }

        // last month
        public static FilterDto last_month(this FilterDto filter)
        {
            filter.Start = DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1).AddMonths(-1);
            filter.End = DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1);

            return filter;
        }

        //last 3 month
        public static FilterDto last_3_month(this FilterDto filter)
        {
            filter.Start = DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1).AddMonths(-3);
            filter.End = DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1);

            return filter;
        }

        //this year
        public static FilterDto this_year(this FilterDto filter)
        {
            filter.Start = new DateTime(DateTime.Now.Date.Year,1,1);
            filter.End = DateTime.Now.Date.AddDays(1);

            return filter;
        }

        //last year
        public static FilterDto last_year(this FilterDto filter)
        {
            filter.Start = new DateTime(DateTime.Now.Date.Year -1, 1, 1); // DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1).AddMonths(-1);
            filter.End = new DateTime(DateTime.Now.Date.Year - 1, 12, 31); //DateTime.Now.Date.AddDays(-(int)DateTime.Now.Day + 1);

            return filter;
        }

    }
}
