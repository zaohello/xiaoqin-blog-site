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
	bio: "博客更新长期干货。时效性消息（如低价Gemini等）请加TG或QQ。点击下方图标加入频道，不定时掉落会员羊毛。",
	links: [
		{
			name: "Telegram",
			url: "https://t.me/fanxiaoqin2580",
			icon: "fa6-brands:telegram",
		},
		{
			name: "QQ群",
			url: "https://qun.qq.com/universal-share/share?ac=1&authKey=fkXG4aS9yYrwQupVNxrt19M9iEalErkzWGZHiFr7grjl3Fd4AAnH21nnupDfVzyu&busi_data=eyJncm91cENvZGUiOiIxMTA1OTg0NjI4IiwidG9rZW4iOiJXcERZcmZpMnhMWnRnMk1VSFQrNThrRkhKd2dscTREcDNQcE0wbUJ4Ui9WUHBTaDBCSUpOWU53NHdJdTFwYzJrIiwidWluIjoiMzE1MzQ3ODg4OSJ9&data=gp3zYqDEAC1tQx4FfORBSNgtj7fnzMxI_8yrM_4hqBFkaBS5XgRrlO7dKxXib4ynIRuVTt0n4kLIlv9Q_7otSQ&svctype=4&tempid=h5_group_in",
			icon: "fa6-brands:qq",
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
