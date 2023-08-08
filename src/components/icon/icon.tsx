import { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as INCH } from '../../assets/1inch.svg';
import { ReactComponent as ADA } from '../../assets/ADA.svg';
import { ReactComponent as ALGO } from '../../assets/ALGO.svg';
import { ReactComponent as AVAX } from '../../assets/AVAX.svg';
import { ReactComponent as GMX } from '../../assets/GMX.svg';
import { ReactComponent as AAVE } from '../../assets/aave.svg';
import { ReactComponent as ACH } from '../../assets/ach.svg';
import { ReactComponent as AGIX } from '../../assets/agix.svg';
import { ReactComponent as AION } from '../../assets/aion.svg';
import { ReactComponent as ALICE } from '../../assets/alice.svg';
import { ReactComponent as ANT } from '../../assets/ant.svg';
import { ReactComponent as APE } from '../../assets/ape.svg';
import { ReactComponent as ARBITRUM } from '../../assets/arbitrum.svg';
import { ReactComponent as ArrowDark } from '../../assets/arrow-dark.svg';
import { ReactComponent as ArrowFullDark } from '../../assets/arrow-full-dark.svg';
import { ReactComponent as ArrowFullLight } from '../../assets/arrow-full-light.svg';
import { ReactComponent as ArrowLight } from '../../assets/arrow-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/arrow-on-dark.svg';
import { ReactComponent as SwapperLight } from '../../assets/arrow-on-light.svg';
import { ReactComponent as AUDIO } from '../../assets/audio.svg';
import { ReactComponent as AVAXC } from '../../assets/avaxc.svg';
import { ReactComponent as BCH } from '../../assets/bch.svg';
import { ReactComponent as BlackCircle } from '../../assets/black-circle.svg';
import { ReactComponent as BNB } from '../../assets/bnb.svg';
import { ReactComponent as BNT } from '../../assets/bnt.svg';
import { ReactComponent as BSC } from '../../assets/bsc.svg';
import { ReactComponent as BTC } from '../../assets/btc.svg';
import { ReactComponent as BUSD } from '../../assets/busd.svg';
import { ReactComponent as CheckDark } from '../../assets/check-dark.svg';
import { ReactComponent as CheckLight } from '../../assets/check-light.svg';
import { ReactComponent as CHZ } from '../../assets/chz.svg';
import { ReactComponent as DAI } from '../../assets/dai.svg';
import { ReactComponent as DOGE } from '../../assets/doge.svg';
import { ReactComponent as DOT } from '../../assets/dot.svg';
import { ReactComponent as ERROR } from '../../assets/error.svg';
import { ReactComponent as ETH } from '../../assets/eth.svg';
import { ReactComponent as FTT } from '../../assets/ftt.svg';
import { ReactComponent as GLMR } from '../../assets/glmr.svg';
import { ReactComponent as INFO } from '../../assets/info.svg';
import { ReactComponent as LINK } from '../../assets/link.svg';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as MANA } from '../../assets/mana.svg';
import { ReactComponent as MATIC } from '../../assets/matic.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import { ReactComponent as OPTIMISM } from '../../assets/optimism.svg';
import { ReactComponent as QNT } from '../../assets/qnt.svg';
import { ReactComponent as QuestionMark } from '../../assets/question-mark.svg';
import { ReactComponent as SAND } from '../../assets/sand.svg';
import { ReactComponent as Search } from '../../assets/search.svg';
import { ReactComponent as SettingsDark } from '../../assets/settings-dark.svg';
import { ReactComponent as SettingsLight } from '../../assets/settings-light.svg';
import { ReactComponent as SHIB } from '../../assets/shib.svg';
import { ReactComponent as SOL } from '../../assets/sol.svg';
import { ReactComponent as SUCCESS } from '../../assets/success.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as SUSHI } from '../../assets/sushi.svg';
import { ReactComponent as TRX } from '../../assets/trx.svg';
import { ReactComponent as UNI } from '../../assets/uni.svg';
import { ReactComponent as USDT } from '../../assets/usdt.svg';
import { ReactComponent as WARNING } from '../../assets/warning.svg';
import { ReactComponent as WBTC } from '../../assets/wbtc.svg';
import { ReactComponent as XRP } from '../../assets/xrp.svg';
import { ReactComponent as XTZ } from '../../assets/xtz.svg';

// import { ReactComponent as AVAXAPT } from '../../assets/AVAXAPT.svg';
import { ReactComponent as APT } from '../../assets/APT.svg';
import { ReactComponent as AR } from '../../assets/AR.svg';
import { ReactComponent as ARDR } from '../../assets/ARDR.svg';
import { ReactComponent as ATOM } from '../../assets/ATOM.svg';
import { ReactComponent as BAND } from '../../assets/BAND.svg';
import { ReactComponent as BEAM } from '../../assets/BEAM.svg';
import { ReactComponent as CELO } from '../../assets/CELO.svg';
import { ReactComponent as CTXC } from '../../assets/CTXC.svg';
import { ReactComponent as ELF } from '../../assets/ELF.svg';
import { ReactComponent as EOS } from '../../assets/EOS.svg';
import { ReactComponent as FET } from '../../assets/FET.svg';
import { ReactComponent as FIL } from '../../assets/FIL.svg';
import { ReactComponent as FLOW } from '../../assets/FLOW.svg';
import { ReactComponent as FTM } from '../../assets/FTM.svg';
import { ReactComponent as ICP } from '../../assets/ICP.svg';
import { ReactComponent as ICX } from '../../assets/ICX.svg';
import { ReactComponent as INJ } from '../../assets/INJ.svg';
import { ReactComponent as IOTA } from '../../assets/IOTA.svg';
import { ReactComponent as IOTX } from '../../assets/IOTX.svg';
import { ReactComponent as IRIS } from '../../assets/IRIS.svg';
import { ReactComponent as JOE } from '../../assets/JOE.svg';
import { ReactComponent as KAVA } from '../../assets/KAVA.svg';
import { ReactComponent as KLAY } from '../../assets/KLAY.svg';
import { ReactComponent as KSM } from '../../assets/KSM.svg';
import { ReactComponent as LSK } from '../../assets/LSK.svg';
import { ReactComponent as LTC } from '../../assets/LTC.svg';
import { ReactComponent as LUNA } from '../../assets/LUNA.svg';
import { ReactComponent as LUNC } from '../../assets/LUNC.svg';
import { ReactComponent as MAGIC } from '../../assets/MAGIC.svg';
import { ReactComponent as MINA } from '../../assets/MINA.svg';
import { ReactComponent as MOB } from '../../assets/MOB.svg';
import { ReactComponent as MOVR } from '../../assets/MOVR.svg';
import { ReactComponent as NEAR } from '../../assets/NEAR.svg';
import { ReactComponent as NEBL } from '../../assets/NEBL.svg';
import { ReactComponent as ONE } from '../../assets/ONE.svg';
import { ReactComponent as OSMO } from '../../assets/OSMO.svg';
import { ReactComponent as QTUM } from '../../assets/QTUM.svg';
import { ReactComponent as REEF } from '../../assets/REEF.svg';
import { ReactComponent as RON } from '../../assets/RON.svg';
import { ReactComponent as ROSE } from '../../assets/ROSE.svg';
import { ReactComponent as RSK } from '../../assets/RSK.svg';
import { ReactComponent as RUNE } from '../../assets/RUNE.svg';
import { ReactComponent as RVN } from '../../assets/RVN.svg';
import { ReactComponent as SCRT } from '../../assets/SCRT.svg';
import { ReactComponent as SPELL } from '../../assets/SPELL.svg';
import { ReactComponent as STG } from '../../assets/STG.svg';
import { ReactComponent as THETA } from '../../assets/THETA.svg';
import { ReactComponent as VET } from '../../assets/VET.svg';
import { ReactComponent as WAN } from '../../assets/WAN.svg';
import { ReactComponent as WAVES } from '../../assets/WAVES.svg';
import { ReactComponent as XEC } from '../../assets/XEC.svg';
import { ReactComponent as XLM } from '../../assets/XLM.svg';
import { ReactComponent as XMR } from '../../assets/XMR.svg';
import { ReactComponent as ZEC } from '../../assets/ZEC.svg';
import { ReactComponent as ZEN } from '../../assets/ZEN.svg';
import { ReactComponent as ZIL } from '../../assets/ZIL.svg';
import { ReactComponent as ADX } from '../../assets/adx.svg';
import { ReactComponent as AKRO } from '../../assets/akro.svg';
import { ReactComponent as AMB } from '../../assets/amb.svg';
import { ReactComponent as ANC } from '../../assets/anc.svg';
import { ReactComponent as ANKR } from '../../assets/ankr.svg';
import { ReactComponent as ARK } from '../../assets/ark.svg';
import { ReactComponent as ARPA } from '../../assets/arpa.svg';
import { ReactComponent as ATA } from '../../assets/ata.svg';
import { ReactComponent as AUTO } from '../../assets/auto.svg';
import { ReactComponent as AXS } from '../../assets/axs.svg';
import { ReactComponent as BAKE } from '../../assets/bake.svg';
import { ReactComponent as BAL } from '../../assets/bal.svg';
import { ReactComponent as BAT } from '../../assets/bat.svg';
import { ReactComponent as BETA } from '../../assets/beta.svg';
import { ReactComponent as BICO } from '../../assets/bico.svg';
import { ReactComponent as BIDR } from '../../assets/bidr.svg';
import { ReactComponent as BLZ } from '../../assets/blz.svg';
import { ReactComponent as BNX } from '../../assets/bnx.svg';
import { ReactComponent as BURGER } from '../../assets/burger.svg';
import { ReactComponent as C98 } from '../../assets/c98.svg';
import { ReactComponent as CAKE } from '../../assets/cake.svg';
import { ReactComponent as CHESS } from '../../assets/chess.svg';
import { ReactComponent as CHR } from '../../assets/chr.svg';
import { ReactComponent as COCOS } from '../../assets/cocos.svg';
import { ReactComponent as COMP } from '../../assets/comp.svg';
import { ReactComponent as COTI } from '../../assets/coti.svg';
import { ReactComponent as CRV } from '../../assets/crv.svg';
import { ReactComponent as CVP } from '../../assets/cvp.svg';
import { ReactComponent as CVX } from '../../assets/cvx.svg';
import { ReactComponent as DAR } from '../../assets/dar.svg';
import { ReactComponent as DASH } from '../../assets/dash.svg';
import { ReactComponent as DEGO } from '../../assets/dego.svg';
import { ReactComponent as DENT } from '../../assets/dent.svg';
import { ReactComponent as DEXE } from '../../assets/dexe.svg';
import { ReactComponent as DOCK } from '../../assets/dock.svg';
import { ReactComponent as DOCUMENTS } from '../../assets/documents.svg';
import { ReactComponent as DODO } from '../../assets/dodo.svg';
import { ReactComponent as DREP } from '../../assets/drep.svg';
import { ReactComponent as DUSK } from '../../assets/dusk.svg';
import { ReactComponent as DYDX } from '../../assets/dydx.svg';
import { ReactComponent as EGLD } from '../../assets/egld.svg';
import { ReactComponent as ENJ } from '../../assets/enj.svg';
import { ReactComponent as ENS } from '../../assets/ens.svg';
import { ReactComponent as EPX } from '../../assets/epx.svg';
import { ReactComponent as ETC } from '../../assets/etc.svg';
import { ReactComponent as FIDA } from '../../assets/fida.svg';
import { ReactComponent as FINANCES } from '../../assets/finances.svg';
import { ReactComponent as FIS } from '../../assets/fis.svg';
import { ReactComponent as FOR } from '../../assets/for.svg';
import { ReactComponent as FORTH } from '../../assets/forth.svg';
import { ReactComponent as FXS } from '../../assets/fxs.svg';
import { ReactComponent as GAL } from '../../assets/gal.svg';
import { ReactComponent as GALA } from '../../assets/gala.svg';
import { ReactComponent as GMT } from '../../assets/gmt.svg';
import { ReactComponent as GRT } from '../../assets/grt.svg';
import { ReactComponent as GTC } from '../../assets/gtc.svg';
import { ReactComponent as HBAR } from '../../assets/hbar.svg';
import { ReactComponent as HFT } from '../../assets/hft.svg';
import { ReactComponent as HIGH } from '../../assets/high.svg';
import { ReactComponent as HNT } from '../../assets/hnt.svg';
import { ReactComponent as HOOK } from '../../assets/hook.svg';
import { ReactComponent as HOT } from '../../assets/hot.svg';
import { ReactComponent as ILV } from '../../assets/ilv.svg';
import { ReactComponent as IMX } from '../../assets/imx.svg';
import { ReactComponent as JASMY } from '../../assets/jasmy.svg';
import { ReactComponent as KDA, ReactComponent as KDA2 } from '../../assets/kda.svg';
import { ReactComponent as KEY } from '../../assets/key.svg';
import { ReactComponent as KNC } from '../../assets/knc.svg';
import { ReactComponent as LAZIO } from '../../assets/lazio.svg';
import { ReactComponent as LDO } from '../../assets/ldo.svg';
import { ReactComponent as LEVER } from '../../assets/lever.svg';
import { ReactComponent as LINA } from '../../assets/lina.svg';
import { ReactComponent as LIT } from '../../assets/lit.svg';
import { ReactComponent as LOKA } from '../../assets/loka.svg';
import { ReactComponent as LPT } from '../../assets/lpt.svg';
import { ReactComponent as LRC } from '../../assets/lrc.svg';
import { ReactComponent as MASK } from '../../assets/mask.svg';
import { ReactComponent as MBOX } from '../../assets/mbox.svg';
import { ReactComponent as MDT } from '../../assets/mdt.svg';
import { ReactComponent as MFT } from '../../assets/mft.svg';
import { ReactComponent as MIR } from '../../assets/mir.svg';
import { ReactComponent as MKR } from '../../assets/mkr.svg';
import { ReactComponent as MoneyAnimated } from '../../assets/money-animated.svg';
import { ReactComponent as MTL } from '../../assets/mtl.svg';
import { ReactComponent as NEO, ReactComponent as NEO3 } from '../../assets/neo.svg';
import { ReactComponent as NEXO } from '../../assets/nexo.svg';
import { ReactComponent as NKN } from '../../assets/nkn.svg';
import { ReactComponent as NMR } from '../../assets/nmr.svg';
import { ReactComponent as OCEAN } from '../../assets/ocean.svg';
import { ReactComponent as OG } from '../../assets/og.svg';
import { ReactComponent as OGN } from '../../assets/ogn.svg';
import { ReactComponent as OM } from '../../assets/om.svg';
import { ReactComponent as OMG } from '../../assets/omg.svg';
import { ReactComponent as ONT } from '../../assets/ont.svg';
import { ReactComponent as OOKI } from '../../assets/ooki.svg';
import { ReactComponent as OP } from '../../assets/op.svg';
import { ReactComponent as PASSPORT } from '../../assets/passport.svg';
import { ReactComponent as PAXG } from '../../assets/paxg.svg';
import { ReactComponent as PEOPLE } from '../../assets/people.svg';
import { ReactComponent as PERL } from '../../assets/perl.svg';
import { ReactComponent as PERP } from '../../assets/perp.svg';
import { ReactComponent as PHA } from '../../assets/pha.svg';
import { ReactComponent as PHB } from '../../assets/phb.svg';
import { ReactComponent as PLA } from '../../assets/pla.svg';
import { ReactComponent as PNT } from '../../assets/pnt.svg';
import { ReactComponent as POWR } from '../../assets/powr.svg';
import { ReactComponent as PROS } from '../../assets/pros.svg';
import { ReactComponent as PSG } from '../../assets/psg.svg';
import { ReactComponent as PYR } from '../../assets/pyr.svg';
import { ReactComponent as RAD } from '../../assets/rad.svg';
import { ReactComponent as RARE } from '../../assets/rare.svg';
import { ReactComponent as RAY } from '../../assets/ray.svg';
import { ReactComponent as REN } from '../../assets/ren.svg';
import { ReactComponent as REQ } from '../../assets/req.svg';
import { ReactComponent as RIF } from '../../assets/rif.svg';
import { ReactComponent as RLC } from '../../assets/rlc.svg';
import { ReactComponent as RNDR } from '../../assets/rndr.svg';
import { ReactComponent as RSR } from '../../assets/rsr.svg';
import { ReactComponent as SANTOS } from '../../assets/santos.svg';
import { ReactComponent as SELFIE } from '../../assets/selfie.svg';
import { ReactComponent as SFP } from '../../assets/sfp.svg';
import { ReactComponent as SLP } from '../../assets/slp.svg';
import { ReactComponent as SNM } from '../../assets/snm.svg';
import { ReactComponent as SNX } from '../../assets/snx.svg';
import { ReactComponent as SRM } from '../../assets/srm.svg';
import { ReactComponent as STORJ } from '../../assets/storj.svg';
import { ReactComponent as SXP } from '../../assets/sxp.svg';
import { ReactComponent as TKO } from '../../assets/tko.svg';
import { ReactComponent as TLM } from '../../assets/tlm.svg';
import { ReactComponent as TORN } from '../../assets/torn.svg';
import { ReactComponent as TRB } from '../../assets/trb.svg';
import { ReactComponent as TROY } from '../../assets/troy.svg';
import { ReactComponent as TWT } from '../../assets/twt.svg';
import { ReactComponent as UFT } from '../../assets/uft.svg';
import { ReactComponent as UNFI } from '../../assets/unfi.svg';
import { ReactComponent as USTC } from '../../assets/ustc.svg';
import { ReactComponent as VGX } from '../../assets/vgx.svg';
import { ReactComponent as VIB } from '../../assets/vib.svg';
import { ReactComponent as VIDT } from '../../assets/vidt.svg';
import { ReactComponent as VOXEL } from '../../assets/voxel.svg';
import { ReactComponent as WIN } from '../../assets/win.svg';
import { ReactComponent as WNXM } from '../../assets/wnxm.svg';
import { ReactComponent as WOO } from '../../assets/woo.svg';
import { ReactComponent as XVS } from '../../assets/xvs.svg';
import { ReactComponent as YFI } from '../../assets/yfi.svg';
import { ReactComponent as YFII } from '../../assets/yfii.svg';
import { ReactComponent as YGG } from '../../assets/ygg.svg';
import { ReactComponent as TRASHBIN } from '../../assets/trash.svg';


import { useStore } from '../../helpers';
import type { ThemeProps } from '../../styles';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET,
	DEFAULT_TRANSITION,
	pxToRem,
	spacing
} from '../../styles';

const Icons = {
	passport: PASSPORT,
	documents: DOCUMENTS,
	finances: FINANCES,
	selfie: SELFIE,
	'1inch': INCH,
	adx: ADX,
	ankr: ANKR,
	arpa: ARPA,
	ata: ATA,
	ada: ADA,
	auto: AUTO,
	axs: AXS,
	bake: BAKE,
	bal: BAL,
	bat: BAT,
	beta: BETA,
	bidr: BIDR,
	blz: BLZ,
	bnx: BNX,
	burger: BURGER,
	c98: C98,
	cake: CAKE,
	chr: CHR,
	coti: COTI,
	comp: COMP,
	chess: CHESS,
	cocos: COCOS,
	dar: DAR,
	dego: DEGO,
	dexe: DEXE,
	dodo: DODO,
	drep: DREP,
	dusk: DUSK,
	epx: EPX,
	hbar: HBAR,
	aion: AION,
	arbitrum: ARBITRUM,
	aave: AAVE,
	ach: ACH,
	agix: AGIX,
	alice: ALICE,
	algo: ALGO,
	ant: ANT,
	ape: APE,
	audio: AUDIO,
	bch: BCH,
	bnt: BNT,
	chz: CHZ,
	dai: DAI,
	doge: DOGE,
	dot: DOT,
	ftt: FTT,
	gmx: GMX,
	link: LINK,
	optimism: OPTIMISM,
	qnt: QNT,
	sand: SAND,
	shib: SHIB,
	sushi: SUSHI,
	uni: UNI,
	wbtc: WBTC,
	bsc: BSC,
	usdt: USDT,
	glmr: GLMR,
	btc: BTC,
	bnb: BNB,
	eth: ETH,
	sol: SOL,
	busd: BUSD,
	trx: TRX,
	matic: MATIC,
	avaxc: AVAXC,
	avax: AVAX,
	xrp: XRP,
	xtz: XTZ,
	defaultIcon: BlackCircle,
	info: INFO,
	warning: WARNING,
	success: SUCCESS,
	error: ERROR,
	questionMark: QuestionMark,
	sun: Sun,
	moon: Moon,
	menuDark: MenuDark,
	menuLight: MenuLight,
	logoDark: LogoDark,
	logoLight: LogoLight,
	checkDark: CheckDark,
	checkLight: CheckLight,
	logoMobile: LogoMobile,
	arrowDark: ArrowDark,
	arrowLight: ArrowLight,
	arrowFullDark: ArrowFullDark,
	arrowFullLight: ArrowFullLight,
	search: Search,
	swapperDark: SwapperDark,
	swapperLight: SwapperLight,
	settingsDark: SettingsDark,
	settingsLight: SettingsLight,
	moneyAnimated: MoneyAnimated,
	trashBin: TRASHBIN,

	// avaxapt: AVAXAPT,
	akro: AKRO,
	bico: BICO,
	crv: CRV,
	cvp: CVP,
	cvx: CVX,
	dydx: DYDX,
	dent: DENT,
	enj: ENJ,
	ens: ENS,
	fida: FIDA,
	fis: FIS,
	for: FOR,
	forth: FORTH,
	fxs: FXS,
	gal: GAL,
	gala: GALA,
	gmt: GMT,
	grt: GRT,
	gtc: GTC,
	hft: HFT,
	high: HIGH,
	hot: HOT,
	hook: HOOK,
	ilv: ILV,
	imx: IMX,
	jasmy: JASMY,
	kda: KDA,
	key: KEY,
	knc: KNC,
	lazio: LAZIO,
	lever: LEVER,
	lina: LINA,
	ldo: LDO,
	lit: LIT,
	loka: LOKA,
	lpt: LPT,
	lrc: LRC,
	mana: MANA,
	mask: MASK,
	mbox: MBOX,
	mdt: MDT,
	mft: MFT,
	mkr: MKR,
	mtl: MTL,
	nexo: NEXO,
	nkn: NKN,
	nmr: NMR,
	ocean: OCEAN,
	og: OG,
	ogn: OGN,
	om: OM,
	omg: OMG,
	ont: ONT,
	ooki: OOKI,
	paxg: PAXG,
	people: PEOPLE,
	perl: PERL,
	perp: PERP,
	pha: PHA,
	phb: PHB,
	pla: PLA,
	pnt: PNT,
	psg: PSG,
	powr: POWR,
	pyr: PYR,
	santos: SANTOS,
	sfp: SFP,
	slp: SLP,
	snx: SNX,
	sxp: SXP,
	storj: STORJ,
	rad: RAD,
	ray: RAY,
	rare: RARE,
	ren: REN,
	req: REQ,
	rif: RIF,
	rlc: RLC,
	rndr: RNDR,
	rsr: RSR,
	tko: TKO,
	twt: TWT,
	tlm: TLM,
	trb: TRB,
	troy: TROY,
	unfi: UNFI,
	vidt: VIDT,
	vgx: VGX,
	voxel: VOXEL,
	win: WIN,
	wnxm: WNXM,
	woo: WOO,
	xvs: XVS,
	yfi: YFI,
	yfii: YFII,
	ygg: YGG,
	op: OP,
	amb: AMB,
	ark: ARK,
	uft: UFT,
	dock: DOCK,
	mir: MIR,
	pros: PROS,
	snm: SNM,
	torn: TORN,
	vib: VIB,
	hnt: HNT,
	anc: ANC,
	ustc: USTC,
	srm: SRM,
	ar: AR,
	apt: APT,
	ardr: ARDR,
	atom: ATOM,
	band: BAND,
	beam: BEAM,
	celo: CELO,
	ctxc: CTXC,
	dash: DASH,
	elf: ELF,
	egld: EGLD,
	eos: EOS,
	etc: ETC,
	fet: FET,
	fil: FIL,
	flow: FLOW,
	ftm: FTM,
	icp: ICP,
	icx: ICX,
	inj: INJ,
	iota: IOTA,
	iotx: IOTX,
	iris: IRIS,
	joe: JOE,
	kava: KAVA,
	kda2: KDA2,
	klay: KLAY,
	ksm: KSM,
	lsk: LSK,
	ltc: LTC,
	luna: LUNA,
	lunc: LUNC,
	mina: MINA,
	mob: MOB,
	movr: MOVR,
	magic: MAGIC,
	near: NEAR,
	nebl: NEBL,
	neo: NEO,
	neo3: NEO3,
	one: ONE,
	osmo: OSMO,
	qtum: QTUM,
	reef: REEF,
	ron: RON,
	rose: ROSE,
	rsk: RSK,
	rune: RUNE,
	rvn: RVN,
	spell: SPELL,
	scrt: SCRT,
	stg: STG,
	theta: THETA,
	vet: VET,
	wan: WAN,
	waves: WAVES,
	xec: XEC,
	xlm: XLM,
	xmr: XMR,
	zec: ZEC,
	zen: ZEN,
	zil: ZIL,
};

export type IconType = keyof typeof Icons;
export type SizeType = 'small' | 'medium' | 'large' | number;

type Props = {
	icon: IconType | undefined;
	size?: SizeType;
	onClick?: () => void;
	style?: CSSProperties;
};

type StyleProps = Omit<Props, 'icon'> & ThemeProps;

const fontSize = (size: SizeType) => {
	switch (size) {
		case 'small':
			return pxToRem(24);
		case 'medium':
			return pxToRem(32);
		case 'large':
			return pxToRem(40);
		default:
			return pxToRem(size);
	}
};

const StyledIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	cursor: ${(props: StyleProps) => (props.onClick ? 'pointer' : 'unset')};
	transition: ${DEFAULT_TRANSITION};

	${(props: StyleProps) =>
		props.onClick && props.size === 'large'
			? css`
				padding: ${spacing[8]} ${spacing[12]};
				border: 1px solid ${props.theme.border.default};
				border-radius: ${DEFAULT_BORDER_RADIUS};
				display: flex;
				align-items: center;
				justify-content: center;
				background: ${`linear-gradient(to left, ${props.theme.background.secondary}, ${props.theme.background.secondary})`};
				transition: ${DEFAULT_TRANSITION};

				& svg {
					font-size: ${spacing[32]};
				}
			`
			: null}
	${(props: StyleProps) =>
		props.onClick
			? css`
				outline: 1px solid transparent;

				&:hover {
					opacity: 0.8;
				}

				&:focus-visible {
					outline-offset: ${DEFAULT_OUTLINE_OFFSET};
					outline: ${(props: StyleProps) => DEFAULT_OUTLINE(props.theme)};
				}

				&:active {
					outline: none;
				}
			`
			: null}
	& > * {
		width: 1em;
		height: 1em;
		font-size: ${(props: StyleProps) => fontSize(props.size ?? 'medium')};
	}
`;

export const Icon = ({ icon, size, onClick, style = {} }: Props) => {
	const {
		state: { theme }
	} = useStore();

	const Icon = icon && Icons.hasOwnProperty(icon) ? Icons[icon] : Icons['defaultIcon'];

	return Icon ? (
		<StyledIcon onClick={onClick} size={size} theme={theme} style={style} data-testid="icon">
			<Icon onClick={onClick ?? null} theme={theme} />
		</StyledIcon>
	) : null;
};
