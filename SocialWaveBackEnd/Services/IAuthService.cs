public interface IAuthService
{
    public Task<IReturn<string>> Register(UserInfo model, string role);
    public Task<IReturn<string>> Login(UserInfo model);
    public interface IReturn<T>
    {
        public EReturnStatus Status { get; }
        public T Result { get; }
    }
}
