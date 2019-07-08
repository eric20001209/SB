using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class remove_payment_method_from_tran_invoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "tran_invoice");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PaymentMethod",
                table: "tran_invoice",
                nullable: true);
        }
    }
}
