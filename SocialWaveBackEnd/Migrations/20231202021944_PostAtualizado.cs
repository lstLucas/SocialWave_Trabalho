using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialWaveBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class PostAtualizado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feed_UserInfos_AuthorId",
                table: "Feed");

            migrationBuilder.DropIndex(
                name: "IX_Feed_AuthorId",
                table: "Feed");

            migrationBuilder.AlterColumn<Guid>(
                name: "AuthorId",
                table: "Feed",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.Sql(
                "INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount) VALUES " +
                "('e87e0496-9d48-4549-9ce9-3cad7a521fdb', 'Admin01', 'ADMIN01', 'admin@email.com', 'ADMIN@EMAIL.COM', 0, 'AQAAAAIAAYagAAAAEDBmVNw+nKFWX54A7dGLrDVo6PADgBpo6ZrL9jJ3id3bpOWLrPeFSTZo+U+94bnbjw==', 'XRIWDWJAN2YTWLBEGDBXTCBH6UFPIKQG', 'c6f13abc-fed6-4a95-ba1d-5ec50aa1e6c4', NULL, 0, 0, NULL, 1, 0)");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "AuthorId",
                table: "Feed",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.CreateIndex(
                name: "IX_Feed_AuthorId",
                table: "Feed",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feed_UserInfos_AuthorId",
                table: "Feed",
                column: "AuthorId",
                principalTable: "UserInfos",
                principalColumn: "Id");

            migrationBuilder.Sql(
                "DELETE FROM AspNetUsers WHERE Id = 'e87e0496-9d48-4549-9ce9-3cad7a521fdb';"
            );
        }
    }
}
