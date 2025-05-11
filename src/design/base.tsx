import Paper from "@mui/material/Paper";
import { createTheme, styled } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    primary: {
      main: "#981E32",
      light: "#b12b41",
      dark: "#801929",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5E6A71",
      light: "#808a91",
      dark: "#4a5459",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#2a3033",
      secondary: "#5E6A71",
    },
    error: {
      main: "#981E32",
    },
    divider: "#5E6A71",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          "&.MuiButton-contained": {
            backgroundColor: "#981E32",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#801929",
            },
          },
          "&.MuiButton-outlined": {
            borderColor: "#981E32",
            color: "#981E32",
            "&:hover": {
              backgroundColor: "rgba(152, 30, 50, 0.04)",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#981E32",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(94, 106, 113, 0.1)",
        },
      },
    },
  },
});

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#981E32",
  }),
}));
