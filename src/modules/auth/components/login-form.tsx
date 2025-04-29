'use client';

export default function LoginForm(): React.ReactNode {
  return (
    <div className="card card-border border-base-300">
      <div className="card-body">
        <h1 className="card-title">Sign in</h1>
        <form>
          <div className="flex flex-col gap-4">
            <label htmlFor="login" className="input">
              <span className="label">Login</span>
              <input type="text" name="login" id="login" />
            </label>

            <label htmlFor="password" className="input">
              <span className="label">Password</span>
              <input type="password" name="password" id="password" />
            </label>
          </div>

          <div className="mt-5">
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
