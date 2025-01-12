using System.Threading.Tasks;

namespace RssReader.Services;

public interface IAuthService
{
    Task SignInAsync(string username, string password);
    Task SignOutAsync();
}
