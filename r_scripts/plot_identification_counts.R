options(stringsAsFactors = FALSE)

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 3) {
  stop("Usage: Rscript plot_identification_counts.R <input_csv> <output_prefix> <value_column> [label_column] [title] [x_label]")
}

input_csv <- args[[1]]
output_prefix <- args[[2]]
value_column <- args[[3]]
label_column <- if (length(args) >= 4) args[[4]] else "Name"
plot_title <- if (length(args) >= 5) args[[5]] else "Identification Counts"
x_label <- if (length(args) >= 6) args[[6]] else value_column

pal_colors <- c(
  "PEAC" = "#72A6DE",
  "imCRC" = "#E57374",
  "MIX" = "#81C784"
)
pal_extend <- c("#FFB74D", "#BA68C8", "#4DB6AC", "#A1887F", "#90A4AE",
                "#FFF176", "#CE93D8", "#80DEEA", "#F48FB1", "#A5D6A7")
palette_values <- c(unname(pal_colors), pal_extend)

df <- read.csv(input_csv, check.names = FALSE, na.strings = c("", "NA", "NaN", "NULL"))
if (!value_column %in% names(df)) stop(sprintf("Value column not found: %s", value_column))
if (!label_column %in% names(df)) stop(sprintf("Label column not found: %s", label_column))

df <- df[!is.na(df[[value_column]]), , drop = FALSE]
df[[value_column]] <- as.numeric(df[[value_column]])
df <- df[order(df[[value_column]], decreasing = FALSE), , drop = FALSE]

plot_horizontal_bar <- function(path, device = c("png", "pdf")) {
  device <- match.arg(device)
  height <- max(4.5, 1.2 + nrow(df) * 0.36)
  width <- 8.5
  if (device == "png") {
    png(path, width = width, height = height, units = "in", res = 300)
  } else {
    pdf(path, width = width, height = height)
  }
  on.exit(dev.off(), add = TRUE)

  op <- par(no.readonly = TRUE)
  on.exit(par(op), add = TRUE)
  par(mar = c(4.8, 9.5, 3.2, 1.8), xaxs = "i", las = 1)

  cols <- rep(palette_values, length.out = nrow(df))
  values <- df[[value_column]]
  labels <- df[[label_column]]
  x_max <- max(values, na.rm = TRUE)
  if (!is.finite(x_max) || x_max <= 0) x_max <- 1
  xlim <- c(0, x_max * 1.18)

  bp <- barplot(
    values,
    names.arg = labels,
    horiz = TRUE,
    col = cols,
    border = "white",
    xlim = xlim,
    xlab = x_label,
    main = plot_title,
    cex.names = 0.85,
    cex.axis = 0.85
  )
  label_text <- if (max(values, na.rm = TRUE) <= 1) sprintf("%.3f", values) else format(values, big.mark = ",", trim = TRUE)
  text(values, bp, labels = label_text, pos = 4, cex = 0.78, xpd = TRUE)
  box(bty = "l", col = "#666666")
}

plot_horizontal_bar(paste0(output_prefix, ".png"), "png")
plot_horizontal_bar(paste0(output_prefix, ".pdf"), "pdf")

