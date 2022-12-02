import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtTokenService: JwtService) {}

  /**
   * Verify wallet and return signer address
   * @params message, signature and address
   * @return signer address
   */
  verifyWalletAndReturnSignerAddress(
    message: string,
    signature: string,
    address: string,
  ) {
    try {
      const signerAddr = verifyMessage(message, signature);
      if (signerAddr != address) {
        return false;
      }
      return signerAddr;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Validate user and return signer address or null value
   * @params message, signature and address
   * @return signer address
   */
  async validateUser(
    message: string,
    signature: string,
    address: string,
  ): Promise<any> {
    const signerAddress = this.verifyWalletAndReturnSignerAddress(
      message,
      signature,
      address,
    );
    console.log(signerAddress);
    if (signerAddress) {
      return signerAddress;
    }
    return null;
  }

  /**
   * Generate User Access Token and save it into the cookies
   * @params message, signature and address
   * @return access token
   */
  async generateUserAccessToken(
    message: string,
    signature: string,
    address: string,
  ) {
    const payload = {
      address: address,
      signature: signature,
      message: message,
    };
    const token = this.jwtTokenService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return {
      access_token: token,
    };
  }
}
