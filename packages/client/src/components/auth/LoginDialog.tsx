import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Dialog } from "@mui/material";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useAuth, useLogin } from "../../states/auth";
import { useIsAuthDialogOpen, useSetIsAuthDialogOpen } from "../../states/ui";
import { useRequestMagicLoginLinkMutation } from "./LoginDialog.generated";

enum AuthMethod {
  Password,
  MagicLink,
}

export const LoginDialog = () => {
  const [authMethod, setAuthMethod] = useState(AuthMethod.MagicLink);
  const { login, isLoginInProgress } = useLogin();
  const [
    requestMagicLoginLink,
    { loading: isMagicLinkRequestLoading, data: requestMagicLoginLinkData },
  ] = useRequestMagicLoginLinkMutation();
  const isAuthDialogOpen = useIsAuthDialogOpen();
  const setIsAuthDialogOpen = useSetIsAuthDialogOpen();
  const { error: loginError } = useAuth();
  const error =
    authMethod === AuthMethod.Password
      ? loginError
      : requestMagicLoginLinkData?.requestMagicLoginLink?.error;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      await login(
        data.get("email")?.toString() || "",
        data.get("password")?.toString() || ""
      );
      setIsAuthDialogOpen(false);
    },
    []
  );

  const handleRequestMagicLoginLink = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get("email"),
        password: data.get("password"),
      });
      const result = await requestMagicLoginLink({
        variables: {
          email: data.get("email")?.toString() || "",
        },
      });
      console.log({ result });
      if (result.data?.requestMagicLoginLink?.success) {
        setIsAuthDialogOpen(false);
      }
    },
    []
  );

  // Use `disableScrollLock` because it's applying inline body.styles.overflow style changes 
  //   with something else at the same time, resulting in non-scrollable window
  return (
    <Dialog
      onClose={() => setIsAuthDialogOpen(false)}
      open={isAuthDialogOpen}
      disableScrollLock
    >
      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in with SurveyStack
        </Typography>
        {authMethod === AuthMethod.Password ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        /> */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoginInProgress}
            >
              Sign In
            </LoadingButton>
            {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleRequestMagicLoginLink}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isMagicLinkRequestLoading}
            >
              Send Link
            </LoadingButton>
          </Box>
        )}

        {error ? <Alert severity="error">{error}</Alert> : null}
        <Button
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          endIcon={<ArrowForwardIcon />}
          onClick={() => setIsAuthDialogOpen(false)}
        >
          Continue without login
        </Button>
        <Button
          variant="text"
          onClick={() =>
            setAuthMethod(
              authMethod === AuthMethod.Password
                ? AuthMethod.MagicLink
                : AuthMethod.Password
            )
          }
        >
          {authMethod === AuthMethod.Password
            ? "email me a sign in link instead"
            : "sign in with password instead"}
        </Button>
      </Box>
    </Dialog>
  );
};
