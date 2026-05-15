import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "小勤的博客",
	subtitle: "记录建站、AI 工具、写作和日常灵感。",
	ogImage: "/assets/site-cover-sakura-lake.jpg",
	lang: "zh_CN",
	themeColor: {
		hue: 205,
		fixed: true,
	},
	banner: {
		enable: true,
		src: "/assets/site-cover-sakura-lake.jpg",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		{
			src: "/assets/avatar.svg",
			sizes: "64x64",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/assets/avatar-cat.jpg",
	name: "小勤",
	bio: "此博客更新一些不会过期的方法，更多时效性的信息在tg或者QQ（比如低价Gemini，等小众渠道消息）点击下面图标即可加入频道，频道不定时分享会员羊毛",
	links: [
		{
			name: "Telegram",
			url: "https://t.me/fanxiaoqin2004",
			icon: "fa6-brands:telegram",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
