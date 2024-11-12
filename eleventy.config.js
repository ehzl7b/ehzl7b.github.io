export default async function(eleventyConfig) {
	eleventyConfig.setInputDirectory("_srcs");
  eleventyConfig.addPassthroughCopy({ "_assets": "/" });
};