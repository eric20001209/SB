using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class add_payment_method_to_tran_invoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PaymentMethod",
                table: "tran_invoice",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "tran_invoice");
        }
    }
}
