import { Thumbnail, SigninLayout } from "@components/signin";
import { Grid, Typography } from "@mui/material";
import RoutePath from "@routes/routePath";
import { useNavigate } from "react-router-dom";

export default function SigninPage() {
  const navigate = useNavigate();
  

  return (
    <Grid container>
      <Thumbnail />
      <SigninLayout
        type="WARD"
        footer={
          <Typography
            onClick={() => navigate(RoutePath.AdminSignin)}
            variant="h3"
            sx={{
              cursor: "pointer",
            }}
          >
            어드민 계정 로그인
          </Typography>
        }
      />
    </Grid>
  );
}
