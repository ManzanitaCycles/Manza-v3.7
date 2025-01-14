const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
    // Pass through the favicon folder to the public directory
    eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });
    // Pass through _headers file
    eleventyConfig.addPassthroughCopy({ "src/_headers": "/" });
    // Passthrough images
    eleventyConfig.addPassthroughCopy("src/assets/");
    // Post image shortcode
    eleventyConfig.addShortcode("img", function (src, alt, myClass) {
        return `<img class="${myClass}" data-blink-uuid="${src}" alt="${alt}" width="2496" height="1664">`;
    });
    // Minify CSS
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });
    // Compress HTML
    eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
        if (outputPath.endsWith(".html")) {
            return htmlmin.minify(content, {
                collapseWhitespace: true,
                removeComments: true,
                useShortDoctype: true,
                minifyCSS: true,
                minifyJS: true
            });
        }
        return content;
    });
    // Post icon shortcode
    eleventyConfig.addShortcode("icon", function (src, alt) {
        return `<img data-blink-uuid="${src}" alt="${alt}" width="100" height="100">`;
    });
    // Testimonial shortcode
    eleventyConfig.addShortcode("quote", function (src, alt, quote, name) {
        return `<figure class="not-prose p-3 bg-white rounded-md border border-stone-200">
            <img data-blink-uuid="${src}" alt="${alt}" width="800" height="800">
            <blockquote class="py-3 italic"><q>${quote}</q></blockquote>
            <figcaption class="text-stone-500">${name}</figcaption>`
    });
    return {
        pathPrefix: "/",
        dir: {
            input: "src",
            output: "public"
        },
        trailingSlash: "always", // Enforces trailing slashes
    };
};