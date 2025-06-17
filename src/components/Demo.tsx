/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import sdk, { SignIn as SignInCore } from "@farcaster/frame-sdk";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { ShareButton } from "./ui/Share";
import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, degen, mainnet, optimism, unichain } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
import { useSession } from "next-auth/react";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { USE_WALLET, APP_NAME } from "~/lib/constants";
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { Separator } from '~/components/ui/separator';
import { 
  Minus, 
  Plus, 
  Zap, 
  Users, 
  Clock, 
  Star,
  Wallet,
  Shield,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export type Tab = 'home' | 'actions' | 'context' | 'wallet';

interface NeynarUser {
  fid: number;
  score: number;
}

export default function Demo(
  { title }: { title?: string } = { title: "Pro Badges Mint" }
) {
  const {
    isSDKLoaded,
    context,
    added,
    notificationDetails,
    actions,
  } = useMiniApp();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [sendNotificationResult, setSendNotificationResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [neynarUser, setNeynarUser] = useState<NeynarUser | null>(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply] = useState(1000);
  const [mintPrice] = useState(0.01);
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();

  // Check if connected to Base network
  useEffect(() => {
    if (isConnected && chainId !== base.id) {
      setNetworkError("Please switch to Base network to mint");
    } else {
      setNetworkError(null);
    }
  }, [chainId, isConnected]);

  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const handleSwitchToBase = async () => {
    try {
      await switchChain({ chainId: base.id });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connect({ connector: config.connectors[0] });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleMint = useCallback(async () => {
    if (!isConnected) {
      await handleConnectWallet();
      return;
    }

    if (chainId !== base.id) {
      await handleSwitchToBase();
      return;
    }

    setIsMinting(true);
    setMintProgress(0);

    try {
      // Simulate minting progress (replace with actual transaction)
      const interval = setInterval(() => {
        setMintProgress((prev) => {
          if (prev >= 90) { // Stop at 90% to wait for actual tx confirmation
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Example transaction - replace with your actual contract call
      const hash: any = await sendTransaction({
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878", // Replace with your contract
        value: BigInt(Math.floor(mintPrice * 1e18 * mintAmount)),
        data: `0x1249c58b${mintAmount.toString(16).padStart(64, '0')}`, // Example mint function
      });

      setTxHash(hash);
      setMintProgress(100);
      setTotalMinted(prev => prev + mintAmount);
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setIsMinting(false);
    }
  }, [sendTransaction, mintAmount, isConnected, chainId, mintPrice]);

  const incrementMintAmount = () => {
    if (mintAmount < 10) {
      setMintAmount(mintAmount + 1);
    }
  };

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  // Mock total supply data
  const progressPercentage = (totalMinted / maxSupply) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Pro Badges
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Each NFT is procedurally generated with rare traits and special abilities for pro casters.
          </p>
          <Badge variant="secondary" className="mt-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Zap className="w-4 h-4 mr-1" />
            Live Mint
          </Badge>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-7xl mx-auto">
          {/* NFT Preview */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-16 h-16 sm:w-24 sm:h-24 text-white/70" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <Badge className="bg-black/50 text-white border-white/20 text-xs sm:text-sm">
                      #{Math.floor(Math.random() * 10000)}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs sm:text-sm">
                      <Star className="w-3 h-3 mr-1" />
                      Early
                    </Badge>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-t from-slate-900/90 to-transparent">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Pro Badges</h3>
                  <p className="text-sm sm:text-base text-slate-300">
                    A unique NFT collection for pro casters, featuring rare traits and special abilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-2 sm:p-4 text-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-white">{totalMinted.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-slate-400">Minted</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-2 sm:p-4 text-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-white">{maxSupply.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-slate-400">Total Supply</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-2 sm:p-4 text-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-white">{mintPrice}</div>
                  <div className="text-xs sm:text-sm text-slate-400">ETH Each</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Minting Panel */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Mint Your Badge</h2>
                  <p className="text-sm sm:text-base text-slate-300">Choose quantity and mint your NFT</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <div className="flex justify-between text-xs sm:text-sm text-slate-300 mb-1 sm:mb-2">
                    <span>Minting Progress</span>
                    <span>{totalMinted}/{maxSupply}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 sm:h-3 bg-slate-700" />
                  <div className="text-center text-xs text-slate-400 mt-1">
                    {(100 - progressPercentage).toFixed(1)}% remaining
                  </div>
                </div>

                <Separator className="bg-slate-700/50 mb-4 sm:mb-6 md:mb-8" />

                {/* Quantity Selector */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Quantity (Max 10)
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                      <Button
                        onClick={decrementMintAmount}
                        disabled={mintAmount <= 1}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-slate-600 hover:border-purple-500 transition-colors"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white w-12 sm:w-16 text-center">
                        {mintAmount}
                      </div>
                      <Button
                        onClick={incrementMintAmount}
                        disabled={mintAmount >= 10}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-slate-600 hover:border-purple-500 transition-colors"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Price Calculation */}
                  <Card className="bg-slate-700/30 border-slate-600/50">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-slate-300">Total Price</span>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold text-white">
                            {(mintPrice * mintAmount).toFixed(3)} ETH
                          </div>
                          <div className="text-xs text-slate-400">
                            ~${(mintPrice * mintAmount * 2000).toFixed(0)} USD
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Network Error */}
                  {networkError && (
                    <Card className="bg-red-500/10 border-red-500/30">
                      <CardContent className="p-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-red-300">{networkError}</span>
                      </CardContent>
                    </Card>
                  )}

                  {/* Mint Progress */}
                  {(isMinting || isConfirming) && (
                    <Card className="bg-purple-500/10 border-purple-500/30">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
                          <span className="text-sm sm:text-base text-purple-300 font-medium">
                            {isConfirming ? 'Confirming transaction...' : 'Minting in progress...'}
                          </span>
                        </div>
                        <Progress value={mintProgress} className="h-2 bg-purple-900/50" />
                        <div className="text-xs text-purple-300 mt-1">{mintProgress}% Complete</div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Mint Button */}
                  <Button
                    onClick={handleMint}
                    disabled={isMinting || isConfirming || totalMinted >= maxSupply}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25"
                  >
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {!isConnected ? 'Connect Wallet' : 
                     isMinting ? 'Minting...' : 
                     isConfirming ? 'Confirming...' : 
                     `Mint ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}`}
                  </Button>

                  <div className="text-center text-xs sm:text-sm text-slate-400">
                    By minting, you agree to our terms of service
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-2 sm:p-4 text-center">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                  <div className="text-sm sm:text-base font-semibold text-white">Secure</div>
                  <div className="text-xs text-slate-400">Verified Smart Contract</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-2 sm:p-4 text-center">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-1 sm:mb-2" />
                  <div className="text-sm sm:text-base font-semibold text-white">Unique</div>
                  <div className="text-xs text-slate-400">Rare Attributes</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ... (keep the rest of your utility functions unchanged)

function SignEvmMessage() {
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const {
    signMessage,
    data: signature,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const handleSignMessage = useCallback(async () => {
    if (!isConnected) {
      await connectAsync({
        chainId: base.id,
        connector: config.connectors[0],
      });
    }

    signMessage({ message: "Hello from Pro Badges!" });
  }, [connectAsync, isConnected, signMessage]);

  return (
    <>
      <Button
        onClick={handleSignMessage}
        disabled={isSignPending}
        isLoading={isSignPending}
      >
        Sign Message
      </Button>
      {isSignError && renderError(signError)}
      {signature && (
        <div className="mt-2 text-xs">
          <div>Signature: {signature}</div>
        </div>
      )}
    </>
  );
}

function SendEth() {
  const { isConnected, chainId } = useAccount();
  const {
    sendTransaction,
    data,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const toAddr = useMemo(() => {
    // Protocol guild address
    return chainId === base.id
      ? "0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
      : "0xB3d8d7887693a9852734b4D25e9C0Bb35Ba8a830";
  }, [chainId]);

  const handleSend = useCallback(() => {
    sendTransaction({
      to: toAddr,
      value: 1n,
    });
  }, [toAddr, sendTransaction]);

  return (
    <>
      <Button
        onClick={handleSend}
        disabled={!isConnected || isSendTxPending}
        isLoading={isSendTxPending}
      >
        Send Transaction (eth)
      </Button>
      {isSendTxError && renderError(sendTxError)}
      {data && (
        <div className="mt-2 text-xs">
          <div>Hash: {truncateAddress(data)}</div>
          <div>
            Status:{" "}
            {isConfirming
              ? "Confirming..."
              : isConfirmed
              ? "Confirmed!"
              : "Pending"}
          </div>
        </div>
      )}
    </>
  );
}

function SignIn() {
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
  const [signInFailure, setSignInFailure] = useState<string>();
  const { data: session, status } = useSession();

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      setSigningIn(true);
      setSignInFailure(undefined);
      const nonce = await getNonce();
      const result = await sdk.actions.signIn({ nonce });
      setSignInResult(result);

      await signIn("credentials", {
        message: result.message,
        signature: result.signature,
        redirect: false,
      });
    } catch (e) {
      if (e instanceof SignInCore.RejectedByUser) {
        setSignInFailure("Rejected by user");
        return;
      }

      setSignInFailure("Unknown error");
    } finally {
      setSigningIn(false);
    }
  }, [getNonce]);

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      setSignInResult(undefined);
    } finally {
      setSigningOut(false);
    }
  }, []);

  return (
    <>
      {status !== "authenticated" && (
        <Button onClick={handleSignIn} disabled={signingIn}>
          Sign In with Farcaster
        </Button>
      )}
      {status === "authenticated" && (
        <Button onClick={handleSignOut} disabled={signingOut}>
          Sign out
        </Button>
      )}
      {session && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">Session</div>
          <div className="whitespace-pre">
            {JSON.stringify(session, null, 2)}
          </div>
        </div>
      )}
      {signInFailure && !signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
          <div className="whitespace-pre">{signInFailure}</div>
        </div>
      )}
      {signInResult && !signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
          <div className="whitespace-pre">
            {JSON.stringify(signInResult, null, 2)}
          </div>
        </div>
      )}
    </>
  );
}

const renderError = (error: Error | null) => {
  if (!error) return null;
  if (error instanceof BaseError) {
    const isUserRejection = error.walk(
      (e) => e instanceof UserRejectedRequestError
    );

    if (isUserRejection) {
      return <div className="text-red-500 text-xs mt-1">Rejected by user.</div>;
    }
  }

  return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
};