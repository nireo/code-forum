import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import Typography from "@material-ui/core";
import Link from "@material-ui/core/Link";

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h4"
      }
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h6"
      }
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "subtitle1"
      }
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "caption",
        paragraph: true
      }
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link }
  }
};

export default function Markdown(props: any) {
  return <ReactMarkdown options={options} {...props} />;
}
